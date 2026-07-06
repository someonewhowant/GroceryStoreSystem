import { Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { CatalogModule } from './catalog/catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, CatalogModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
