import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';

@ApiTags('discounts')
@Controller('api/discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  create(@Body() createCampaignDto: any) {
    return this.discountsService.createCampaign(createCampaignDto);
  }

  @Get()
  findAll() {
    return this.discountsService.getAllCampaigns();
  }
}
