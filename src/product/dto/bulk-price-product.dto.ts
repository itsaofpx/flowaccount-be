import {
  IsArray,
  IsInt,
  IsNumber,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PriceUpdateItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the product to update',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  productId!: number;

  @ApiProperty({
    example: 20.5,
    description: 'New price of the product',
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  newPrice!: number;
}

export class BulkPriceUpdateDto {
  @ApiProperty({
    type: [PriceUpdateItemDto],
    description: 'List of products and their new prices',
    example: [
      {
        productId: 1,
        newPrice: 20,
      },
      {
        productId: 2,
        newPrice: 30,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceUpdateItemDto)
  updates!: PriceUpdateItemDto[];
}
