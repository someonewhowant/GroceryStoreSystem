import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../db/database.module';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { CatalogService } from '../catalog/catalog.service';
import { InventoryService } from '../inventory/inventory.service';
import { DiscountsService } from '../discounts/discounts.service';
import { DiscountFactory } from '../discounts/domain/discount.factory';

@Injectable()
export class CheckoutService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
    private catalogService: CatalogService,
    private inventoryService: InventoryService,
    private discountsService: DiscountsService,
  ) {}

  startOrder() {
    const id = uuidv4();
    this.db.insert(schema.orders).values({
      id,
      status: 'PENDING',
      createdAt: new Date(),
    }).run();
    return { orderId: id };
  }

  addItemToOrder(orderId: string, barcode: string, quantity: number) {
    const item = this.catalogService.findOne(barcode);
    if (!item) {
      throw new NotFoundException(`Item with barcode ${barcode} not found`);
    }

    this.db.insert(schema.orderItems).values({
      orderId,
      barcode,
      quantity,
      priceAtCheckout: item.price,
    }).run();
    return { success: true };
  }

  getOrderState(orderId: string) {
    const items = this.db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, orderId)).all();
    const campaigns = this.discountsService.getAllCampaigns();
    
    let subtotal = 0;
    let total = 0;
    const itemsWithDiscounts: any[] = [];

    for (const orderItem of items) {
      const catalogItem = this.catalogService.findOne(orderItem.barcode);
      if (!catalogItem) continue;

      const itemCost = catalogItem.price * orderItem.quantity;
      subtotal += itemCost;

      let finalPrice = catalogItem.price;
      let appliedCampaign: string | null = null;

      for (const campaign of campaigns) {
        try {
          const criteria = DiscountFactory.createCriteria(campaign.criteria);
          const strategy = DiscountFactory.createStrategy(campaign.strategy);

          if (criteria.isSatisfiedBy({ barcode: catalogItem.barcode, category: catalogItem.category, price: catalogItem.price })) {
            const discountAmount = strategy.calculateDiscount(catalogItem.price);
            if (catalogItem.price - discountAmount < finalPrice) {
              finalPrice = catalogItem.price - discountAmount;
              appliedCampaign = campaign.name;
            }
          }
        } catch (e) {
          // ignore invalid configs
        }
      }

      const totalFinalCost = finalPrice * orderItem.quantity;
      total += totalFinalCost;

      itemsWithDiscounts.push({
        ...orderItem,
        name: catalogItem.name,
        category: catalogItem.category,
        originalPrice: catalogItem.price,
        finalPrice,
        appliedCampaign
      });
    }

    return {
      orderId,
      items: itemsWithDiscounts,
      subtotal,
      total,
    };
  }

  processPayment(orderId: string, paymentAmount: number) {
    const state = this.getOrderState(orderId);
    
    const orderResults = this.db.select().from(schema.orders).where(eq(schema.orders.id, orderId)).limit(1).all();
    if (orderResults.length === 0) throw new NotFoundException('Order not found');
    const order = orderResults[0];
    if (order.status === 'COMPLETED') throw new BadRequestException('Order already paid');

    this.db.transaction((tx) => {
      // Process inventory
      for (const item of state.items) {
        const stock = this.inventoryService.getStock(item.barcode);
        if (stock && stock.stockCount >= item.quantity) {
            tx.insert(schema.inventory).values({ barcode: item.barcode, stockCount: -item.quantity })
              .onConflictDoUpdate({
                target: schema.inventory.barcode,
                set: { stockCount: sql`${schema.inventory.stockCount} - ${item.quantity}` }
              }).run();
        } else {
          throw new BadRequestException(`Insufficient stock for ${item.barcode}`);
        }
      }

      tx.update(schema.orders)
        .set({ status: 'COMPLETED', paymentAmount })
        .where(eq(schema.orders.id, orderId)).run();
    });

    return {
      receipt: {
        orderId,
        items: state.items,
        subtotal: state.subtotal,
        total: state.total,
        paymentAmount,
        change: paymentAmount - state.total,
      }
    };
  }
}
