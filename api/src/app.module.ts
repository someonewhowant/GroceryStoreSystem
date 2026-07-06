import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { CatalogModule } from './catalog/catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { DiscountsModule } from './discounts/discounts.module';
import { CheckoutModule } from './checkout/checkout.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule, 
    CatalogModule, 
    InventoryModule,
    DiscountsModule,
    CheckoutModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
