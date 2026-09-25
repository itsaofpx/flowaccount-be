import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Product, ProductCategory } from './product.entity';
import { SellProductDto } from './dto/sell-product.dto';
import { CreateProductDto } from './dto/product.dto';
import { BulkPriceUpdateDto } from './dto/bulk-price-product.dto';

@Injectable()
export class ProductService {
  // private products: Product[] = [];
  private products: Product[] = [
    {
      id: 1,
      name: 'ข้าวสาร',
      sku: 'RICE001',
      price: 50.0,
      stock: 100,
      category: ProductCategory.FOOD,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'ข้าวสาร',
      sku: 'RICE002',
      price: 50.0,
      stock: 100,
      category: ProductCategory.FOOD,
      createdAt: new Date(),
    }
  ];
  private nextId = 1;

  create(dto: CreateProductDto): Product {
    const existingProduct = this.products.find(
      (product) => product.sku.toLowerCase() === dto.sku.toLowerCase(),
    );

    if (dto.name.trim() == '') {
      throw new BadRequestException({
        errors: ['ชื่อสินค้าต้องไม่ว่าง'],
      });
    }

    if (dto.sku.trim().length < 3) {
      throw new BadRequestException({
        errors: ['SKU ต้องมีอย่างน้อย 3 ตัวอักษร'],
      });
    }

    if (dto.price <= 0) {
      throw new BadRequestException({
        errors: ['ราคาสินค้าต้องมากกว่า 0'],
      });
    }

    if (existingProduct) {
      throw new BadRequestException({
        errors: ['SKU นี้มีอยู่แล้วในระบบ'],
      });
    }

    const product: Product = {
      id: this.nextId++,
      name: dto.name,
      sku: dto.sku,
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
      createdAt: new Date(),
    };

    this.products.push(product);

    return product;
  }

  findAll(category?: ProductCategory): Product[] {
    if (!category) {
      return this.products;
    }

    return this.products.filter((product) => product.category === category);
  }

  sell(dto: SellProductDto): Product {
    const product = this.products.find(
      (product) => product.id === dto.productId,
    );

    if (!product) {
      throw new NotFoundException({
        errors: ['ไม่พบสินค้าที่ต้องการขาย'],
      });
    }
    if (product.stock < dto.quantity) {
      throw new BadRequestException({
        errors: ['จำนวนสินค้าในสต็อกไม่เพียงพอ'],
      });
    }

    product.stock -= dto.quantity;

    return product;
  }

  search(keyword: string): Product[] {
    const normalizedKeyword = keyword.toLowerCase();

    return this.products.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalizedKeyword) ||
        product.sku.toLowerCase().includes(normalizedKeyword)
      );
    });
  }

  bulkUpdatePrice(dto: BulkPriceUpdateDto) {
    let updatedCount = 0;
    let updatedList: Product[] = [];

    for (const update of dto.updates) {
      const product = this.products.find(
        (product) => product.id === update.productId,
      );

      if (!product) {
        continue;
      }

      product.price = update.newPrice;
      updatedCount++;
      updatedList.push(product);
    }

    this.products = this.products.filter(
      (product) => !updatedList.includes(product),
    );

    return {
      updatedCount,
      totalRequested: dto.updates.length,
      updatedProducts: updatedList,
    };
  }
}
