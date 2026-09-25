import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductService } from './product.service';
import { SellProductDto } from './dto/sell-product.dto';
import { ProductCategory } from './product.entity';
import { CreateProductDto } from './dto/product.dto';
import { BulkPriceUpdateDto } from './dto/bulk-price-product.dto';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ProductCategory,
    description: 'Filter products by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  findAll(@Query('category') category?: ProductCategory) {
    return this.productService.findAll(category);
  }

  @Post('sell')
  @ApiOperation({
    summary: 'Sell a product',
  })
  @ApiBody({
    type: SellProductDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Product sold successfully',
  })
  sell(@Body() dto: SellProductDto) {
    return this.productService.sell(dto);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search products',
  })
  @ApiQuery({
    name: 'keyword',
    required: true,
    example: 'ข้าว',
    description: 'Keyword to search for products',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results returned successfully',
  })
  search(@Query('keyword') keyword: string) {
    return this.productService.search(keyword);
  }

  @Put('bulk-price-update')
  @ApiOperation({
    summary: 'Bulk update product prices',
  })
  @ApiBody({
    type: BulkPriceUpdateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Product prices updated successfully',
  })
  bulkUpdatePrice(@Body() dto: BulkPriceUpdateDto) {
    return this.productService.bulkUpdatePrice(dto);
  }
}
