import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/inventory.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':barcode')
  getStock(@Param('barcode') barcode: string) {
    return this.inventoryService.getStock(barcode);
  }

  @Patch(':barcode')
  updateStock(
    @Param('barcode') barcode: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.inventoryService.updateStock(barcode, updateStockDto.count);
  }
}
