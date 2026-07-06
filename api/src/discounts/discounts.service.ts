import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../db/database.module';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DiscountsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  createCampaign(campaignDto: any) {
    const id = uuidv4();
    this.db.insert(schema.discountCampaigns).values({
      id,
      name: campaignDto.name,
      criteria: campaignDto.criteria,
      strategy: campaignDto.strategy,
    }).run();
    return this.db.select().from(schema.discountCampaigns).where(eq(schema.discountCampaigns.id, id)).limit(1).all()[0];
  }

  getAllCampaigns() {
    return this.db.select().from(schema.discountCampaigns).all();
  }
}
