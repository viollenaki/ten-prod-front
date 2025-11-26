TenProduct — Full Frontend Specification (for Copilot)

(Paste this entire specification into SPEC.md in your Next.js project.)

You are an expert frontend engineer and UI/UX designer.

This project is a complete frontend-only implementation of a grocery delivery service called TenProduct.
The backend does not exist yet, so all data must be hard-coded in local files.

The goal is to build a beautiful, modern, responsive UI using:

Next.js (App Router)

React + TypeScript

SCSS modules

Hardcoded mock data (no API calls)

The project must be structured cleanly, modularly, and ready for future backend integration.

🚀 GENERAL REQUIREMENTS
Technology:

Next.js (App Router using app/ directory)

React functional components

TypeScript everywhere

SCSS modules for styling

All mock data stored in data/*.ts

No fetch, no axios, no database — everything is hardcoded

Fully responsive (desktop/tablet/mobile)

Design:

Clean, modern, minimalist UI

Primary color theme: green (fresh/organic)

Accent colors: yellow/orange (energy/speed)

Many white spaces, rounded corners, soft shadows

Professional typography

Images & Assets:

Use placeholder images where appropriate:

<img src="/placeholder.png" alt="..." />


Or use empty <div> with comments:

/* TODO: add illustration */

📁 RECOMMENDED PROJECT STRUCTURE
project/
  app/
    layout.tsx
    page.tsx                // Landing page
    auth/
      page.tsx              // Login/Registration
    app/
      page.tsx              // Catalog + cart
      checkout/
        page.tsx            // Checkout process
    courier/
      page.tsx              // Courier dashboard
    admin/
      page.tsx              // Admin dashboard
  components/
    Header/
    Footer/
    HeroSection/
    FeaturesSection/
    SmartGoalsSection/
    ProductCard/
    CartSidebar/
    FiltersSidebar/
    CheckoutSteps/
    OrderSummary/
    CourierOrderList/
    AdminStatsCards/
    AdminTables/
  data/
    products.ts
    smartGoals.ts
    mockOrders.ts
    mockUsers.ts
  styles/
    globals.scss
  SPEC.md


You may create more folders if needed.

🟩 PAGE 1 — PUBLIC LANDING PAGE (/)

TenProduct — Full Frontend Specification (for Copilot)

(Paste this entire specification into SPEC.md in your Next.js project.)

You are an expert frontend engineer and UI/UX designer.

This project is a complete frontend-only implementation of a grocery delivery service called TenProduct.
The backend does not exist yet, so all data must be hard-coded in local files.

The goal is to build a beautiful, modern, responsive UI using:

Next.js (App Router)

React + TypeScript

SCSS modules

Hardcoded mock data (no API calls)

The project must be structured cleanly, modularly, and ready for future backend integration.

🚀 GENERAL REQUIREMENTS
Technology:

Next.js (App Router using app/ directory)

React functional components

TypeScript everywhere

SCSS modules for styling

All mock data stored in data/*.ts

No fetch, no axios, no database — everything is hardcoded

Fully responsive (desktop/tablet/mobile)

Design:

Clean, modern, minimalist UI

Primary color theme: deep indigo / navy (professional)

Accent colors: warm gold (highlights)

Refined spacing, subtle borders, structured cards

Professional typography

Images & Assets:

Use placeholder images where appropriate:

<img src="/placeholder.png" alt="..." />


Or use empty <div> with comments:

/* TODO: add illustration */

📁 RECOMMENDED PROJECT STRUCTURE
project/
  app/
    layout.tsx
    page.tsx                // Landing page
    auth/
      page.tsx              // Login/Registration
    app/
      page.tsx              // Catalog + cart
      checkout/
        page.tsx            // Checkout process
    courier/
      page.tsx              // Courier dashboard
    admin/
      page.tsx              // Admin dashboard
  components/
    Header/
    Footer/
    HeroSection/
    FeaturesSection/
    SmartGoalsSection/
    ProductCard/
    CartSidebar/
    FiltersSidebar/
    CheckoutSteps/
    OrderSummary/
    CourierOrderList/
    AdminStatsCards/
    AdminTables/
  data/
    products.ts
    smartGoals.ts
    mockOrders.ts
    mockUsers.ts
  styles/
    globals.scss
  SPEC.md


You may create more folders if needed.

🟩 PAGE 1 — PUBLIC LANDING PAGE (/)

Goal: Present the TenProduct service and lead users to registration.

Content to include:
Header

Logo “TenProduct”

Nav links: How it works, Benefits, For Farmers, SMART Goals

Buttons:

"Log in"

"Sign up" (primary, professional)

Hero Section

Left:

Large headline:
“Fresh farm products delivered quickly and reliably”

Subheadline:
“Quality from real farmers. Professional delivery and transparent pricing.”

Buttons:

Primary: “Start Ordering” → /auth

Secondary: “How it works” (scroll to section)

Right:

Placeholder image or product photography placeholder (TODO)

How It Works Section

3–4 steps:

Choose products

Enter address

Smart routing

Track your delivery (placeholder for future)

Benefits Section

Cards:

“Competitive pricing vs supermarkets”

“Fast delivery”

“20+ local farmer partners”

SMART Goals Section

5 cards: Specific, Measurable, Achievable, Relevant, Time-bound
(All text provided in mock data.)

Footer

Links: Company, Partners, Help, Legal

“Admin Login”

🟩 PAGE 2 — AUTH PAGE (/auth)

Contains both Login and Registration.

Features:
Registration

Tabs: Login | Sign Up

Fields:

Name

Email/Phone

Password

Select role:

Customer

Courier

Admin

Button: “Create account”

Redirect based on role:

Customer → /store

Courier → /courier

Admin → /admin

Login

Fields:

Email/Phone

Password

Role selector

Redirect based on role

No backend logic. Everything is local simulation.

🟩 PAGE 3 — CUSTOMER APP PAGE (/store)

Main application: product catalog + filters + cart.

Layout:
Header

Logo

City selector (dummy)

Icons: Profile, Orders (placeholder)

Cart icon with item count

Left Sidebar — Filters

Search input

Category selection:

All

Dairy

Vegetables

Fruits

Citrus

Meat

Bakery

Toggles:

“Farmer products only”

“Under 100₽”

Center — Product Grid

Hardcoded products from data/products.ts.

Product card includes:

Name

Category

Price (e.g. 120 ₽ / kg)

Badge “Farmer product” if isFarm === true

Delivery time (“≈ 15 min”)

Quantity selector (+ / −)

“Add to cart” button

Optional image placeholder

Right Sidebar — Cart

List of items

Increase/decrease quantity

Remove item

Subtotal

Delivery fee

Total

Button “Checkout” → /store/checkout

State stored in React (Context recommended).

🟩 PAGE 4 — CHECKOUT PAGE (/store/checkout)

3-step flow:

Step 1: Address Form

City

Street

House / building

Apartment

Entrance / floor / intercom

Comment for courier

Right side: map placeholder

Button: “Continue to Payment”

Step 2: Payment Method

Options:

Cash to courier

Card to courier

Online payment (placeholder)

If cash:

Input “Need change from: ____ ₽”

Right side:

Order summary

Items from cart

Total price

Button: “Confirm Order”

Step 3: Confirmation

Show:

Big checkmark icon

Text: “Order #1234 placed! Average delivery time ~15 minutes.”

Buttons:

“Back to catalog”

“Track order” (placeholder)

🟩 PAGE 5 — COURIER DASHBOARD (/courier)

Layout:
Header

Logo

Text “Courier Dashboard”

Logout button

Filters

Buttons:

New

In Progress

Delivered

Order List

Hardcoded data in data/mockOrders.ts.

Order card:

Order ID

Customer name

Address

Total

Status badge

Buttons:

If NEW → “Accept order”

If IN_PROGRESS → “Mark as Delivered”

Status updated in local React state.

Optional modal for order details.

🟩 PAGE 6 — ADMIN DASHBOARD (/admin)

Layout:
Sidebar

Dashboard

Products

Orders

Users

Couriers

Top bar

Logo

“Admin Panel”

Dashboard Section

Stats cards:

Orders today

Active couriers

Avg delivery time

Avg order value

Recent orders table.

Products Section

Table:

Name

Category

Price

Farmer flag

Actions: Edit / Delete

Modal or form to add new products.

Users Section

List from mockUsers.ts.

Couriers Section

List from mockUsers.ts filtered by role.

🎨 GLOBAL DESIGN GUIDELINES

Use modern sans-serif fonts

Use deep indigo as primary color

Buttons rounded

Cards with refined border radius

Soft shadows

Balanced spacing and clean typography

Every page must be fully responsive

🧠 IMPLEMENTATION RULES FOR COPILOT

When generating code:

Use TypeScript

Use SCSS modules

Use React components

Use mock data from data/

Do NOT write any backend logic

Keep code clean, readable, and modular

Add comments for future backend integration

Prefer responsive CSS layouts (flex/grid)

✅ END OF SPECIFICATION