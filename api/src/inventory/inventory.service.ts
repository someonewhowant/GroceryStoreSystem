import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { DATABASE_CONNECTION } from '../db/database.module';
import * as schema from '../db/schema';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  getStock(barcode: string) {
    const results = this.db
      .select()
      .from(schema.inventory)
      .where(eq(schema.inventory.barcode, barcode))
      .limit(1)
      .all();

    if (results.length === 0) {
      return { barcode, stockCount: 0 };
    }
    return results[0];
  }

  updateStock(barcode: string, count: number) {
    // Check if the item exists in the catalog first
    const item = this.db
      .select()
      .from(schema.items)
      .where(eq(schema.items.barcode, barcode))
      .limit(1)
      .all();

    if (item.length === 0) {
      throw new NotFoundException(
        `Item with barcode ${barcode} not found in catalog`,
      );
    }

    // Upsert logic for SQLite
    this.db
      .insert(schema.inventory)
      .values({ barcode, stockCount: count })
      .onConflictDoUpdate({
        target: schema.inventory.barcode,
        set: { stockCount: sql`${schema.inventory.stockCount} + ${count}` },
      })
      .run();

    return this.getStock(barcode);
  }
}
