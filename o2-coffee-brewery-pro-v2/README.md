# O2 Coffee Brewery & Eatery — End-to-End Cafe Management & Ordering Website

A complete, role-based web platform built for **O2 Coffee Brewery & Eatery** (A-1331, R.K. Puram, near Chawla Circle, Kota, Rajasthan), maintaining the signature Botanical Boho design system (`#F7F4EF`, `#EFE9DF`, `#4A6B53`, `#C86D51`, *Playfair Display* + *Plus Jakarta Sans*).

## End-to-End Flows Included
1. **Welcome Landing Page (`/`):** Hero showcase of O2 Coffee Brewery & Eatery, table QR selector, cafe ambiance highlights, signature menu preview, and quick entry into Guest Ordering or Staff Login.
2. **Role-Based Staff & Guest Login (`/login`):**
   - **Guest Table Session:** Select your table (T-01 to T-12) and guest name—no password required.
   - **Cafe Manager (`manager@o2kota.in` / `o2manager`):** Full access to Floor Map, Table Status & Counter Bill Settlement, Kitchen & Bar KDS, and Walk-In POS.
   - **Owner / Admin (`admin@o2kota.in` / `o2admin`):** Full access to Executive Analytics, Peak-Hour Orders & Revenue Charts, Menu Category Margins, Recipe-Level Smart Inventory (BOM), and Staff Activity Audit Log.
3. **Guest Menu, Cart & Pay at Counter (`/menu`):**
   - Mood & dietary filters, search, brew customization drawer (milk, sugar, extra shot), shared group cart, **Pay at Counter (Cash/Card/UPI at Desk)** or **Instant Table UPI**, and live order status tracker.
4. **Cafe Manager Console (`/manager`):**
   - Visual Floor Map across *Indoor Botanical*, *Study Nook*, and *Outdoor Patio* zones.
   - **Counter Settlement Desk:** Collect pending *"Pay at Counter"* bills, mark orders *Served*, clear tables back to *Vacant*, and bump KDS tickets.
5. **Owner Admin Dashboard (`/admin`):**
   - Real-time KPIs, Peak-Hour Bar Chart (10 AM – 10 PM), Category Margin Donut, Recipe BOM Auto-Deducting Inventory with 1-click Restock, and live transaction ledger.

## Run Locally
```bash
npm install
npm run dev
```
