import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
