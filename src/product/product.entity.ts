export enum ProductCategory {
  FOOD = 'อาหาร',
  DRINK = 'เครื่องดื่ม',
  HOUSEHOLD = 'ของใช้',
  CLOTHING = 'เสื้อผ้า',
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: ProductCategory;
  createdAt: Date;
}