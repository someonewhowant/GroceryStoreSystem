import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.catalogService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':barcode')
  findOne(@Param('barcode') barcode: string) {
    return this.catalogService.findOne(barcode);
  }

  @Patch(':barcode')
  update(
    @Param('barcode') barcode: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.catalogService.update(barcode, updateItemDto);
  }

  @Delete(':barcode')
  remove(@Param('barcode') barcode: string) {
    return this.catalogService.remove(barcode);
  }
}
