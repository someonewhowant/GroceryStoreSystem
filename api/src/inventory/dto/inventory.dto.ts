import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateStockDto {
  @IsNumber()
  @IsNotEmpty()
  count: number;
}
