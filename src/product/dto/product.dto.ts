import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ProductCategory } from '../product.entity';

export class CreateProductDto {
  @ApiProperty({
    example: 'Premium Coffee',
    description: 'Name of the product',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'COFFEE001',
    description: 'Unique product SKU. Must be at least 3 characters.',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  sku!: string;

  @ApiProperty({
    example: 99.99,
    description: 'Product price',
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  price!: number;

  @ApiProperty({
    example: 100,
    description: 'Available stock quantity',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiProperty({
    enum: ProductCategory,
    example: ProductCategory.FOOD,
    description: 'Product category',
  })
  @IsEnum(ProductCategory)
  category!: ProductCategory;
}
