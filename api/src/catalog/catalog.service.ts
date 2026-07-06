import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { DATABASE_CONNECTION } from '../db/database.module';
import * as schema from '../db/schema';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  findAll() {
    return this.db.select().from(schema.items).all();
  }

  findOne(barcode: string) {
    const results = this.db
      .select()
      .from(schema.items)
      .where(eq(schema.items.barcode, barcode))
      .limit(1)
      .all();

    if (results.length === 0) {
      throw new NotFoundException(`Item with barcode ${barcode} not found`);
    }
    return results[0];
  }

  create(createItemDto: CreateItemDto) {
    this.db.insert(schema.items).values(createItemDto).run();
    return this.findOne(createItemDto.barcode);
  }

  update(barcode: string, updateItemDto: UpdateItemDto) {
    // Check if exists
    this.findOne(barcode);

    this.db
      .update(schema.items)
      .set(updateItemDto)
      .where(eq(schema.items.barcode, barcode))
      .run();
    return this.findOne(barcode);
  }

  remove(barcode: string) {
    // Check if exists
    this.findOne(barcode);

    this.db.delete(schema.items).where(eq(schema.items.barcode, barcode)).run();
    return { success: true };
  }
}
