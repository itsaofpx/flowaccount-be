# Product Management API

ระบบจัดการสินค้า (Product Management API) พัฒนาด้วย **NestJS + TypeScript** สำหรับจัดการสินค้า การค้นหา การขายสินค้า และการอัปเดตราคาสินค้าหลายรายการพร้อมกัน

ปัจจุบันระบบใช้ **In-Memory Storage** สำหรับจัดเก็บข้อมูลสินค้า โดยยังไม่มีการเชื่อมต่อ Database

## Tech Stack

- **NestJS** — Backend Framework
- **TypeScript** — Programming Language
- **class-validator** — Request Validation
- **class-transformer** — Request Transformation
- **Swagger / OpenAPI** — API Documentation
- **In-Memory Storage** — Temporary Data Storage

---

## Features

ระบบรองรับการทำงานหลักดังนี้:

- สร้างสินค้าใหม่
- แสดงรายการสินค้าทั้งหมด
- Filter สินค้าตาม Category
- ค้นหาสินค้าด้วย Keyword
- ขายสินค้าและตัด Stock
- อัปเดตราคาสินค้าหลายรายการในครั้งเดียว
- Request Validation
- Swagger API Documentation

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

### Controller

รับ HTTP Request และส่งต่อข้อมูลให้ Service

### Service

จัดการ Business Logic ของระบบ เช่น:

- สร้างสินค้า
- ค้นหาสินค้า
- ขายสินค้า
- อัปเดต Stock
- Bulk Update ราคา

### DTO

กำหนดรูปแบบ Request และตรวจสอบความถูกต้องของข้อมูลก่อนเข้าสู่ Business Logic

### Entity

ใช้สำหรับกำหนดโครงสร้างและประเภทของ Product ภายในระบบ

---

# Installation

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

# Running the Application

### Development

```bash
npm run start:dev
```

Application จะทำงานที่:

```text
http://localhost:3000
```

---

# API Documentation

ระบบใช้ Swagger สำหรับ API Documentation

หลังจากรัน Application แล้ว สามารถเข้า Swagger UI ได้ที่:

```text
http://localhost:3000/api/docs
```

Swagger สามารถใช้สำหรับ:

- ดู API Endpoint ทั้งหมด
- ดู Request Body
- ดู Query Parameters
- ดู Validation Rules
- ทดลองเรียก API ผ่าน Swagger UI

---

# API Endpoints

## Create Product

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

---

## Get Products

ดึงรายการสินค้าทั้งหมด

```http
GET /api/products
```

สามารถ Filter ตาม Category:

```http
GET /api/products?category=food
```

---

## Search Products

ค้นหาสินค้าด้วย Keyword:

```http
GET /api/products/search?keyword=coffee
```

ตัวอย่าง:

```http
GET /api/products/search?keyword=ข้าว
```

---

## Sell Product

ขายสินค้าและลด Stock:

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

ระบบจะตรวจสอบ:

- Product มีอยู่ในระบบหรือไม่
- Quantity ถูกต้องหรือไม่
- Stock เพียงพอหรือไม่

หากขายสำเร็จ Stock จะถูกลดลงตามจำนวนที่ขาย

---

## Bulk Update Product Price

อัปเดตราคาสินค้าหลายรายการพร้อมกัน:

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

### Validation Configuration

**whitelist**

อนุญาตเฉพาะ properties ที่ถูกกำหนดไว้ใน DTO

**transform**

ช่วยแปลงข้อมูล Request ให้ตรงกับ Type ที่กำหนด

**forbidNonWhitelisted**

ปฏิเสธ Request หากมี property ที่ไม่ได้ถูกกำหนดไว้ใน DTO

ตัวอย่าง Request ที่ไม่ถูกต้อง:

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

Request จะถูกปฏิเสธเนื่องจาก `unknownField` ไม่ได้ถูกกำหนดไว้ใน DTO

---

# In-Memory Storage

ปัจจุบันระบบยังไม่มี Database และใช้ข้อมูลที่จัดเก็บอยู่ภายใน Application Memory

ข้อดี:

- Setup ง่าย
- ไม่ต้องติดตั้ง Database เพิ่ม
- เหมาะสำหรับการทดสอบ API และ Business Logic

ข้อจำกัด:

- ข้อมูลจะหายเมื่อ Restart Application
- ไม่เหมาะสำหรับ Production
- ไม่สามารถแชร์ข้อมูลระหว่างหลาย Application Instances ได้

### Future Improvement

หากนำระบบไปใช้งานจริง สามารถเปลี่ยน Storage Layer เป็น Database เช่น PostgreSQL หรือ MySQL และใช้ ORM เช่น TypeORM หรือ Prisma ได้ โดยแยก Data Access Layer ออกจาก Business Logic เพื่อให้สามารถเปลี่ยน Storage ได้ง่าย

---

# Application Flow

```text
HTTP Request
     │
     ▼
 Controller
     │
     ▼
 DTO Validation
     │
     ▼
 Product Service
     │
     ▼
 In-Memory Storage
     │
     ▼
 HTTP Response
```

---

# Error Handling

ตัวอย่าง HTTP Status Codes:

| Status Code | ความหมาย                              |
| ----------- | ------------------------------------- |
| `200`       | Request สำเร็จ                        |
| `201`       | สร้างข้อมูลสำเร็จ                     |
| `400`       | Request ไม่ถูกต้อง / Validation Error |
| `404`       | ไม่พบ Product                         |
| `409`       | ข้อมูลขัดแย้ง เช่น SKU ซ้ำ            |

ตัวอย่าง Validation Error:

```json
{
  "message": ["sku must be longer than or equal to 3 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

# Available Scripts

```bash
# Development
npm run start:dev

# Production Build
npm run build

# Production
npm run start:prod

# Unit Tests
npm run test

# Test Coverage
npm run test:cov

# Lint
npm run lint
```

---

# Design Approach

โปรเจกต์แบ่งความรับผิดชอบออกเป็น Controller, DTO และ Service เพื่อให้ Business Logic แยกออกจาก HTTP Layer

```text
Controller
    │
    ├── Receive Request
    └── Validate / Pass DTO
            │
            ▼
        Service
            │
            ├── Business Logic
            └── In-Memory Storage
```

แนวทางนี้ช่วยให้สามารถเปลี่ยน Storage ในอนาคตได้โดยไม่จำเป็นต้องเปลี่ยน API Contract หรือ Controller มากนัก

---

# Author

**Podjanin Wachirawittayakul**

Computer Science — Kasetsart University

GitHub: `https://github.com/Itsaofpx`
