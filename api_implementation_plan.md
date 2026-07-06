# План реализации NestJS API для Grocery Store (SQLite + DrizzleORM)

На основе анализа фасада `GroceryStoreSystem` (и связанных сущностей `Catalog`, `Inventory`, `Checkout`, `DiscountCampaign`), проект переносится в архитектуру клиент-сервер. Вместо хранения данных в оперативной памяти (Map/Array) мы используем SQLite и DrizzleORM.

## 1. Схема базы данных (DrizzleORM)

Для хранения данных потребуется спроектировать реляционную модель. Цены (`price`) лучше хранить в целых числах (в центах/копейках), чтобы избежать проблем с точностью float, либо использовать тип `real` и парсить через `big.js` на уровне сервиса.

### Таблицы:
*   **`items`** (Каталог товаров)
    *   `barcode` (PK, string) - штрихкод товара
    *   `name` (string) - название
    *   `category` (string) - категория
    *   `price` (integer) - цена в минимальных единицах (например, центах)
*   **`inventory`** (Складские запасы)
    *   `barcode` (PK, string, FK -> items.barcode)
    *   `stock_count` (integer) - текущее количество
*   **`discount_campaigns`** (Скидочные кампании)
    *   `id` (PK, string) - UUID
    *   `name` (string) - название акции
    *   `criteria` (json) - конфигурация критериев применения (например, `{"type": "category", "value": "Fruits"}`)
    *   `strategy` (json) - конфигурация расчета (например, `{"type": "percentage", "value": 10}`)
    *   *Примечание:* Из-за сложности паттернов "Компоновщик" и "Декоратор" хранение конфигурации в JSON — оптимальный способ сохранения полиморфных правил в реляционной БД.
*   **`orders`** (Заказы)
    *   `id` (PK, string) - UUID заказа
    *   `status` (string) - `PENDING` (собирается) или `COMPLETED` (оплачен)
    *   `payment_amount` (integer) - внесенная сумма
    *   `created_at` (timestamp)
*   **`order_items`** (Товары в корзине заказа)
    *   `id` (PK, integer)
    *   `order_id` (string, FK -> orders.id)
    *   `barcode` (string, FK -> items.barcode)
    *   `quantity` (integer)

---

## 2. Архитектура модулей NestJS

Проект будет разбит на предметные модули, каждый из которых инкапсулирует контроллер, сервис и Drizzle-репозиторий.

1.  **`DatabaseModule`**
    *   Подключение к SQLite через `better-sqlite3`.
    *   Провайдер DrizzleORM, внедряемый в другие сервисы.
2.  **`CatalogModule`**
    *   `CatalogController`: Управление товарами.
    *   `CatalogService`: CRUD-операции с таблицей `items`.
3.  **`InventoryModule`**
    *   `InventoryController`: Управление остатками.
    *   `InventoryService`: Инкремент/декремент поля `stock_count`.
4.  **`DiscountModule`**
    *   `DiscountController`: Настройка акций.
    *   `DiscountService`: Извлечение конфигураций из БД и фабрика, которая воссоздает ООП-классы (`AmountBasedStrategy`, `CompositeCriteria` и т.д.) на лету при расчете.
5.  **`CheckoutModule`**
    *   `CheckoutController`: Работа с корзиной и оплата.
    *   `CheckoutService`: Оркестратор. Объединяет `CatalogService`, `DiscountService` и `InventoryService`. При добавлении товара в заказ рассчитывает скидки на лету. При оплате (status -> COMPLETED) транзакционно списывает запасы из `Inventory`.

---

## 3. Проектирование REST API (Эндпоинты)

### Каталог (Catalog)
*   `POST /api/catalog` - Добавить новый товар (или обновить).
*   `GET /api/catalog` - Получить список всех товаров.
*   `GET /api/catalog/:barcode` - Получить товар по штрихкоду.
*   `DELETE /api/catalog/:barcode` - Удалить товар.

### Запасы (Inventory)
*   `PATCH /api/inventory/:barcode` - Обновить остатки (тело: `{ "count": 10 }`).
*   `GET /api/inventory/:barcode` - Узнать текущий остаток.

### Скидки (Discounts)
*   `POST /api/discounts` - Создать кампанию (тело с JSON-конфигурацией критериев и стратегий).
*   `GET /api/discounts` - Получить список активных кампаний.

### Оформление заказа (Checkout)
*   `POST /api/checkout/orders` - Начать новый заказ (возвращает `orderId`).
*   `POST /api/checkout/orders/:orderId/items` - Добавить товар в корзину (тело: `{ "barcode": "12345", "quantity": 4 }`).
*   `GET /api/checkout/orders/:orderId` - Получить текущее состояние корзины (список товаров, промежуточная сумма, сумма со скидками).
*   `POST /api/checkout/orders/:orderId/pay` - Оплатить заказ (тело: `{ "paymentAmount": 20 }`). Завершает транзакцию, списывает товар со склада и генерирует чек (`Receipt`).

---

## 4. Пошаговый план разработки

**Шаг 1: Настройка БД и DrizzleORM**
1. Установить зависимости: `npm install drizzle-orm better-sqlite3 dotenv`, а также инструменты разработчика: `npm install -D drizzle-kit @types/better-sqlite3`.
2. Создать файлы схем `src/db/schema.ts`.
3. Настроить `drizzle.config.ts` и `DatabaseModule`.

**Шаг 2: Реализация Catalog и Inventory**
1. Сгенерировать и применить миграции БД для таблиц `items` и `inventory`.
2. Создать модули `CatalogModule` и `InventoryModule`.
3. Реализовать контроллеры и сервисы.

**Шаг 3: Адаптация логики скидок**
1. Перенести классы расчета скидок из оригинального проекта (стратегии, критерии, декораторы) в `api/src/discounts/domain/`.
2. Создать фабрику (Factory), которая читает JSON конфигурацию из БД и инстанцирует правильные классы TS.

**Шаг 4: Реализация Checkout (Оформление заказа)**
1. Создать модуль `CheckoutModule`.
2. Написать сервис, который при GET-запросе к корзине на лету достает товары, достает активные скидки и возвращает финальную сумму.
3. Реализовать логику `processPayment`: транзакция в БД для смены статуса заказа на `COMPLETED` и вызова `inventoryService.reduceStock`.

**Шаг 5: Тестирование API**
Использовать встроенный фреймворк NestJS (Jest/Supertest) для сквозного (e2e) тестирования процесса покупок.
