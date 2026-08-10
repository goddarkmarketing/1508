# PDR — GGM Thai Travel Website & Back Office

**เอกสาร:** Product Design Report (PDR)  
**ระบบ:** เว็บไซต์และระบบหลังบ้าน GGM Thai Travel Co., Ltd.  
**เวอร์ชัน:** 1.0  
**วันที่:** 7 สิงหาคม 2026  
**สถานะ:** Production-ready foundation (ข้อมูลจากเอกสารบริษัทจริง)

---

## 1. บทสรุปผู้บริหาร

ระบบนี้เป็นเว็บไซต์องค์กรและช่องทางรับคำขอใบเสนอราคา (Quote Inquiry) ของ **บริษัท จีจีเอ็ม ไทย แทรเวล จำกัด (GGM Thai Travel Co., Ltd.)** ซึ่งเป็น Destination Management Company (DMC) / Tour Operator ในประเทศไทย

ระบบมี 2 ส่วนหลัก:

1. **เว็บไซต์สาธารณะ (Public Website)** — นำเสนอบริษัท จุดหมายปลายทาง แพ็กเกจทัวร์ บริการรถ และช่องทางติดต่อ
2. **ระบบหลังบ้าน (Admin / Back Office)** — ให้ทีมงานดูแคตตาล็อกทัวร์ จุดหมาย และจัดการสถานะใบสอบถามจากลูกค้า/เอเจนซี่

เป้าหมายคือให้พาร์ทเนอร์ท่องเที่ยวและลูกค้าดูโปรแกรมได้ชัดเจน แล้วส่งคำขอราคาได้ทันที โดยทีมขายติดตามงานต่อในหลังบ้าน

---

## 2. ระบบมีหน้าที่ทำอะไร

### 2.1 หน้าที่หลักของระบบ

| หน้าที่ | รายละเอียด |
|---|---|
| นำเสนอแบรนด์บริษัท | แสดงข้อมูลบริษัท ใบอนุญาต TAT ความเชี่ยวชาญ และตลาดที่ให้บริการ |
| จัดแสดง Destinations | แสดงเมือง/เส้นทางท่องเที่ยวที่บริษัทดูแล เช่น Bangkok, Phuket, Chiang Mai, Hat Yai |
| จัดแสดง Tour Packages | แสดงแพ็กเกจพร้อมไฮไลต์ อิตินเนอรี Includes/Excludes |
| แสดงบริการเสริม | Transfer Van/Coach, เรทรถ, Fleet, One-day trip |
| รับคำขอใบเสนอราคา | ฟอร์ม Inquire ส่งเข้าคิวงานของทีมขาย |
| บริหารงานขายเบื้องต้น | Dashboard + อัปเดตสถานะ Inquiry |
| รองรับการขยายต่อ | โครงสร้างพร้อมต่อ Database / CRM / Email notification ในอนาคต |

### 2.2 สิ่งที่ระบบไม่ได้ทำ (ขอบเขตปัจจุบัน)

- ไม่ใช่ระบบจองออนไลน์ชำระเงิน (Booking + Payment)
- ไม่ใช่ระบบออกใบแจ้งหนี้/บัญชี
- ไม่แก้ไขราคา B2B แบบเรียลไทม์จากหน้าเว็บ (ราคาอ้างอิงจากเอกสาร Tariff ของบริษัท)
- ไม่มี Member Portal สำหรับเอเจนซี่ล็อกอินดูเรทลับ (สามารถพัฒนาต่อได้)

---

## 3. ผู้ใช้งานระบบ (User Roles)

| Role | ใคร | ทำอะไรได้ |
|---|---|---|
| **Public Visitor** | ลูกค้าทั่วไป / เอเจนซี่ / พาร์ทเนอร์ | ดูเว็บ, ค้นหาทัวร์, ส่งคำขอใบเสนอราคา, ติดต่อบริษัท |
| **Sales** | ทีมขาย เช่น Ms. Fon | เข้าหลังบ้าน ดู Inquiry อัปเดตสถานะ ดูแคตตาล็อก |
| **Admin** | ผู้ดูแลระบบ / Management | เข้าหลังบ้านเต็มรูปแบบ ดู Dashboard, Catalog, Settings |

> บัญชีสาธิตในระบบปัจจุบัน  
> - Admin: `ggmthaimanagement@gmail.com` / `admin123`  
> - Sales: `ggm.thaitravel@gmail.com` / `sales123`

---

## 4. สถาปัตยกรรมระบบโดยสรุป

```
[ผู้ใช้ทั่วไป / เอเจนซี่]
        │
        ▼
[Public Website]
  Home / About / Destinations / Tours / Services / Contact / Inquire
        │
        ▼
[API: /api/inquiries]
        │
        ▼
[Inquiries Store] ──► [Admin Back Office]
                           Dashboard
                           Tours
                           Destinations
                           Inquiries
                           Settings
```

**เทคโนโลยี:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Lucide Icons  
**โฟลเดอร์โปรเจกต์:** `web/`

---

## 5. Sitemap / โครงสร้างเมนู

### 5.1 Public Website

| หน้า | URL | หน้าที่ |
|---|---|---|
| Home | `/` | แนะนำแบรนด์, Destinations, Featured Tours, CTA ขอราคา |
| About | `/about` | ประวัติบริษัท ค่านิยม ตลาด กลุ่มลูกค้า |
| Destinations | `/destinations` | รายการจุดหมายตามภูมิภาค |
| Destination Detail | `/destinations/[slug]` | รายละเอียดเมือง + แพ็กเกจที่เกี่ยวข้อง |
| Tours | `/tours` | รายการแพ็กเกจ + ค้นหา/กรอง |
| Tour Detail | `/tours/[slug]` | อิตินเนอรี Includes/Excludes ปุ่ม Inquire |
| Services | `/services` | บริการทัวร์, เรท Transfer, Fleet, Day trip |
| Contact | `/contact` | เบอร์โทร อีเมล ผู้ติดต่อ |
| Request Quote | `/inquire` | ฟอร์มขอใบเสนอราคา |
| Success | `/inquire/success` | หน้ายืนยันหลังส่งฟอร์มสำเร็จ |

### 5.2 Authentication & Admin

| หน้า | URL | หน้าที่ |
|---|---|---|
| Login | `/login` | เข้าสู่ระบบหลังบ้าน |
| Dashboard | `/admin` | สรุปจำนวนทัวร์ จุดหมาย Inquiry ค้าง |
| Tours | `/admin/tours` | ตารางแคตตาล็อกทัวร์ |
| Destinations | `/admin/destinations` | ตารางจุดหมาย |
| Inquiries | `/admin/inquiries` | รายการคำขอราคา + อัปเดตสถานะ |
| Settings | `/admin/settings` | ข้อมูลบริษัทและ Session ปัจจุบัน |

---

## 6. คู่มือการใช้งานระบบ

### 6.1 การเปิดระบบ (สำหรับทีมพัฒนา/ไอที)

1. เปิด Terminal ไปที่โฟลเดอร์ `web`
2. ติดตั้ง dependency (ครั้งแรก):
   ```bash
   npm install
   ```
3. รันระบบ:
   ```bash
   npm run dev
   ```
4. เปิดเบราว์เซอร์ที่ **http://localhost:3000**

### 6.2 การใช้งานฝั่งเว็บสาธารณะ

#### A) ดูข้อมูลบริษัท
1. เข้าเมนู **About**
2. อ่านประวัติ TAT License ตลาดที่ให้บริการ และจุดเด่นบริษัท

#### B) สำรวจจุดหมายปลายทาง
1. เข้าเมนู **Destinations**
2. เลือกเมืองที่สนใจ
3. ดู Highlights และแพ็กเกจที่เกี่ยวข้อง
4. กด **Request quote** หากต้องการให้ทีมเสนอราคา

#### C) ดูแพ็กเกจทัวร์
1. เข้าเมนู **Tours**
2. ใช้ช่องค้นหา / กรองประเภท (Private, Join, SIC) / Muslim friendly
3. เปิดรายละเอียดแพ็กเกจเพื่อดู Day-by-day itinerary
4. กด **Inquire about this tour** เพื่อส่งคำขอราคาของแพ็กเกจนั้น

#### D) ดูบริการรถและ Day Trip
1. เข้าเมนู **Services**
2. ดูเรท Transfer Van/Coach (อ้างอิงจากเอกสารบริษัท)
3. ดูรายการรถ Fleet และโปรแกรม Coral Island

#### E) ติดต่อทีมขายโดยตรง
1. เข้าเมนู **Contact**
2. โทรหรือส่งอีเมลถึง Ms. Fon / Ms. Amee ตามข้อมูลที่แสดง

#### F) ส่งคำขอใบเสนอราคา (Inquire)
1. เข้า `/inquire` หรือกดปุ่ม **Request quote**
2. กรอกข้อมูลจำเป็น:
   - ชื่อ *
   - อีเมล *
   - ประเภทคำขอ *
   - ข้อความรายละเอียด *
3. กรอกข้อมูลเสริมได้: เบอร์โทร, บริษัท/เอเจนซี่, จำนวนคน, วันที่เดินทาง, Destination, Tour
4. กด **Send inquiry**
5. ระบบแสดงหน้าสำเร็จ และบันทึกคำขอเข้าหลังบ้านสถานะ `new`

### 6.3 การใช้งานฝั่งหลังบ้าน (Admin / Sales)

#### A) เข้าสู่ระบบ
1. เปิด `/login`
2. กรอกอีเมลและรหัสผ่าน
3. ระบบพาไปที่ `/admin`

#### B) ดู Dashboard
- ดูจำนวน Published tours / Destinations
- ดูจำนวน Inquiry ใหม่และทั้งหมด
- ดูรายการ Inquiry ล่าสุด
- กด Quick actions เพื่อไปจัดการงานต่อ

#### C) จัดการ Inquiries (งานขายหลัก)
1. เข้าเมนู **Inquiries**
2. ดูผู้ติดต่อ ประเภทคำขอ ข้อความ และสถานะ
3. อัปเดตสถานะตามขั้นตอนงาน:
   - `new` = เข้ามาใหม่ ยังไม่รับงาน
   - `in-progress` = กำลังติดต่อ/จัดโปรแกรม
   - `quoted` = ส่งใบเสนอราคาแล้ว
   - `closed` = ปิดงาน

#### D) ตรวจแคตตาล็อก Tours / Destinations
- ใช้สำหรับตรวจสอบข้อมูลที่แสดงบนเว็บ
- กด View เพื่อเปิดหน้าสาธารณะของรายการนั้น

#### E) ดู Settings
- ตรวจข้อมูลบริษัทและสิทธิ์ผู้ใช้ที่ล็อกอินอยู่

#### F) ออกจากระบบ
- กด **Sign out** ที่แถบด้านข้าง

---

## 7. Workflow การทำงานของธุรกิจผ่านระบบ

```
เอเจนซี่/ลูกค้าดูเว็บ
        │
        ▼
เลือก Destination / Tour / Service
        │
        ▼
ส่ง Inquiry (Request Quote)
        │
        ▼
ระบบบันทึกสถานะ = new
        │
        ▼
Sales เข้าหลังบ้าน รับงาน → in-progress
        │
        ▼
จัดทำใบเสนอราคา (นอกระบบ เช่น อีเมล/ไฟล์ Tariff)
        │
        ▼
อัปเดตสถานะ = quoted
        │
        ▼
ปิดงาน = closed
```

ระบบช่วยให้ **รับงานและติดตามสถานะ** ได้เป็นระบบ ลดการหลุดคำขอจากอีเมล/แชทอย่างเดียว

---

## 8. ข้อมูลสำคัญในระบบ (Data Overview)

### 8.1 ข้อมูลบริษัท
- ชื่อ EN/TH, TAT License `14/03695`
- อีเมลติดต่อ, ผู้ติดต่อ Ms. Fon / Ms. Amee
- ตลาด: Malaysia, Singapore, Vietnam, Philippines, Indonesia, Europe, China

### 8.2 Destinations
ครอบคลุมเส้นทางหลัก เช่น Bangkok, Pattaya, Hua Hin, Kanchanaburi, Khao Yai, Chiang Mai, Chiang Rai, Phuket, Krabi, Hat Yai, Betong

### 8.3 Tour Packages
มีแพ็กเกจหลักประมาณ 23 รายการ เช่น
- Bangkok 3D2N / 4D3N / Muslim Private
- Bangkok–Pattaya, Hua Hin, Kanchanaburi, Khao Yai, Khao Kho
- Chiang Mai / Chiang Rai (รวม Muslim)
- Phuket Phi Phi / James Bond
- Krabi 4D3N
- Hat Yai / Betong

### 8.4 Services
- Transfer Van / Coach rates
- Fleet (Commuter, Alphard, Deluxe/VIP Coach)
- Coral Island day trip

---

## 9. ฟอร์มและ Validation

ฟอร์ม Inquire ตรวจสอบอย่างน้อย:
- ชื่ออย่างน้อย 2 ตัวอักษร
- อีเมลถูกต้อง
- ประเภทคำขอต้องเลือก
- ข้อความอย่างน้อย 10 ตัวอักษร
- มีสถานะ Loading ตอนส่ง และแจ้ง Success/Error

---

## 10. สิทธิ์และการรักษาความปลอดภัยเบื้องต้น

- หน้า `/admin/*` ต้องล็อกอิน
- Session เก็บใน Cookie แบบ HttpOnly
- API อ่าน/แก้ Inquiry ในหลังบ้านต้องมี Session
- หน้า Public ส่ง Inquiry ได้โดยไม่ต้องล็อกอิน

---

## 11. ข้อแนะนำการใช้งานจริงในองค์กร

1. ใช้เว็บเป็นช่องทางกลางให้เอเจนซี่ดูโปรแกรมมาตรฐาน
2. ให้ทีมขายเช็ค `/admin/inquiries` ทุกวันทำการ
3. อัปเดตสถานะทันทีเมื่อตอบลูกค้า เพื่อไม่ให้งานซ้ำ
4. ราคา Nett ยังอ้างอิงไฟล์ Tariff ในโฟลเดอร์เอกสารบริษัท
5. หากจะใช้งานจริงระยะยาว ควรต่อ Database, อีเมลแจ้งเตือน และระบบสิทธิ์ละเอียดขึ้น

---

## 12. การพัฒนาต่อในอนาคต (Roadmap แนะนำ)

| ลำดับ | รายการ | ประโยชน์ |
|---|---|---|
| 1 | เชื่อม Database จริง | ข้อมูลไม่หายเมื่อรีสตาร์ทเซิร์ฟเวอร์ |
| 2 | แจ้งเตือนอีเมลเมื่อมี Inquiry ใหม่ | ทีมขายรับงานเร็วขึ้น |
| 3 | Agent portal + rate card | รองรับ B2B ลึกขึ้น |
| 4 | แก้ทัวร์จากหลังบ้าน (CMS) | อัปเดตโปรแกรมโดยไม่ต้องแก้โค้ด |
| 5 | ภาษาไทย/อังกฤษเต็มรูปแบบ | เข้าถึงลูกค้ากว้างขึ้น |

---

## 13. สรุป

ระบบ GGM Thai Travel ทำหน้าที่เป็น **หน้าบ้านนำเสนอสินค้าท่องเที่ยว** และ **หลังบ้านรับ–ติดตามคำขอใบเสนอราคา** เพื่อรองรับการขายแบบ B2B/DMC ให้เป็นมืออาชีพ ใช้งานง่าย และขยายต่อได้

**จุดเข้าใช้งานหลัก**
- เว็บไซต์: `http://localhost:3000`
- หลังบ้าน: `http://localhost:3000/login`
