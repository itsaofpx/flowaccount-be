# Product Management API

ระบบจัดการสินค้า (Product Management API) พัฒนาด้วย **NestJS + TypeScript** สำหรับจัดการข้อมูลสินค้า การค้นหา การขายสินค้า และการอัปเดตราคาสินค้าหลายรายการพร้อมกัน

## Tech Stack

- **NestJS** — Backend Framework
- **TypeScript** — Programming Language
- **PostgreSQL** — Database
- **TypeORM** — ORM
- **Class Validator** — Request Validation
- **Swagger / OpenAPI** — API Documentation
- **Docker** — Database / Application Environment

---

## Features

ระบบรองรับการทำงานหลักดังนี้

- สร้างสินค้าใหม่
- แสดงรายการสินค้าทั้งหมด
- Filter สินค้าตาม Category
- ค้นหาสินค้าด้วย Keyword
- ขายสินค้าและตัด Stock
- อัปเดตราคาสินค้าหลายรายการในครั้งเดียว
- Validate Request ด้วย `class-validator`
- API Documentation ด้วย Swagger

---

## Project Structure

```text
src/
├── product/
│   ├── dto/
│   │   ├── bulk-price-product.dto.ts
│   │   ├── product.dto.ts
│   │   └── sell-product.dto.ts
│   │
│   ├── product.controller.ts
│   ├── product.entity.ts
│   ├── product.module.ts
│   └── product.service.ts
│
├── app.module.ts
└── main.ts
```

### Layer Responsibilities

**Controller**

รับ HTTP Request และส่งต่อข้อมูลให้ Service

**Service**

จัดการ Business Logic ของระบบ เช่น การสร้างสินค้า การขายสินค้า และการอัปเดตราคา

**Entity**

กำหนดโครงสร้างข้อมูล Product และการ Mapping กับ Database

**DTO**

กำหนดรูปแบบ Request และตรวจสอบความถูกต้องของข้อมูลก่อนเข้าสู่ Business Logic

---

## Installation

Clone repository:

```bash
git clone <your-repository-url>
cd be-flowaccount
```

ติดตั้ง dependencies:

```bash
npm install
```

---

## Environment Variables

สร้างไฟล์ `.env` ที่ root ของ project

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=product_db
```

ปรับค่า Database ให้ตรงกับ environment ที่ใช้งาน

> ไม่ควร commit ไฟล์ `.env` ที่มี credentials จริงขึ้น Git repository

---

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

Application จะทำงานที่:

```text
http://localhost:3000
```

---

# API Documentation

Swagger UI สามารถเข้าใช้งานได้ที่:

```text
http://localhost:3000/api/docs
```

Swagger ใช้สำหรับดูรายละเอียด API, Request Body, Query Parameters และสามารถทดลองเรียก API ผ่านหน้าเว็บได้โดยตรง

---

# API Endpoints

## 1. Create Product

สร้างสินค้าใหม่

```http
POST /api/products
```

### Request Body

```json
{
  "name": "Premium Coffee",
  "sku": "COFFEE001",
  "price": 99.99,
  "stock": 100,
  "category": "food"
}
```

### Validation

- `name` ต้องเป็น String
- `sku` ต้องมีความยาวอย่างน้อย 3 ตัวอักษร
- `price` ต้องมากกว่า `0`
- `stock` ต้องไม่ติดลบ
- `category` ต้องเป็น Category ที่ระบบรองรับ

---

## 2. Get Products

ดึงรายการสินค้าทั้งหมด

```http
GET /api/products
```

สามารถ Filter ตาม Category ได้:

```http
GET /api/products?category=food
```

---

## 3. Search Products

ค้นหาสินค้าด้วย Keyword

```http
GET /api/products/search?keyword=coffee
```

ตัวอย่าง:

```http
GET /api/products/search?keyword=ข้าว
```

---

## 4. Sell Product

ขายสินค้าและลดจำนวน Stock

```http
POST /api/products/sell
```

### Request Body

```json
{
  "productId": 1,
  "quantity": 2
}
```

ระบบจะตรวจสอบว่า:

- Product มีอยู่จริงหรือไม่
- จำนวนสินค้าที่ต้องการขายถูกต้องหรือไม่
- Stock เพียงพอหรือไม่

หากขายสำเร็จ ระบบจะลด Stock ตามจำนวนที่ขาย

---

## 5. Bulk Update Product Price

อัปเดตราคาสินค้าหลายรายการพร้อมกัน

```http
PUT /api/products/bulk-price-update
```

### Request Body

```json
{
  "updates": [
    {
      "productId": 1,
      "newPrice": 20
    },
    {
      "productId": 2,
      "newPrice": 30
    }
  ]
}
```

ระบบจะทำการอัปเดตราคาของสินค้าตาม `productId` ที่ระบุ

---

# Validation

ระบบใช้ `ValidationPipe` แบบ Global:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);
```

### Validation Behavior

**whitelist**

อนุญาตเฉพาะ properties ที่ถูกกำหนดไว้ใน DTO

**transform**

แปลง Request Data ให้ตรงกับ Type ที่กำหนดใน DTO

**forbidNonWhitelisted**

หาก Request มี field ที่ไม่ได้ถูกกำหนดไว้ใน DTO ระบบจะ reject request

ตัวอย่าง:

```json
{
  "name": "Coffee",
  "sku": "COF001",
  "price": 50,
  "stock": 10,
  "category": "food",
  "unknownField": "test"
}
```

Request นี้จะถูกปฏิเสธเนื่องจาก `unknownField` ไม่ได้ถูกกำหนดไว้ใน DTO

---

# Swagger

Swagger ถูกใช้สำหรับจัดทำ API Documentation และช่วยให้สามารถทดลอง API ได้โดยไม่ต้องใช้เครื่องมือเพิ่มเติม

ตัวอย่างการกำหนด Swagger ใน DTO:

```ts
@ApiProperty({
  example: 1,
  description: 'ID of the product',
})
productId!: number;
```

ทำให้ Swagger สามารถแสดง:

- Data Type
- Example
- Description
- Validation Constraints
- Enum Values

ได้โดยอัตโนมัติ

---

# Error Handling

ระบบจะคืน HTTP Status Code ตามลักษณะของ Request เช่น

| Status Code | ความหมาย                              |
| ----------- | ------------------------------------- |
| `200`       | Request สำเร็จ                        |
| `201`       | สร้างข้อมูลสำเร็จ                     |
| `400`       | Request ไม่ถูกต้อง / Validation Error |
| `404`       | ไม่พบ Product                         |

ตัวอย่าง Validation Error:

```json
{
  "message": ["sku must be longer than or equal to 3 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

# Development Principles

โปรเจกต์นี้ออกแบบโดยแยกความรับผิดชอบของแต่ละส่วนอย่างชัดเจน:

```text
HTTP Request
     │
     ▼
 Controller
     │
     ▼
   DTO
 Validation
     │
     ▼
  Service
     │
     ▼
 Repository / ORM
     │
     ▼
 Database
```

แนวทางนี้ช่วยให้ Business Logic ไม่ผูกติดกับ HTTP Layer และทำให้สามารถพัฒนาและทดสอบแต่ละส่วนได้ง่ายขึ้น

---

# Available Scripts

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Unit Tests
npm run test

# Test Coverage
npm run test:cov

# Lint
npm run lint
```

---

# Author

**Podjanin Wachirawittayakul**

Computer Science — Kasetsart University

GitHub: `https://github.com/Itsaofpx`
# flowaccount-be
