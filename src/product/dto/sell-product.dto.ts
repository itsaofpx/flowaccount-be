import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SellProductDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the product to sell',
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  productId!: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of products to sell',
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  quantity!: number;
}
