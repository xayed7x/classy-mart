# Demo Mode Guide | ডেমো মোড গাইড

## 🇧🇩 বাংলায়

### ডেমো মোড কী?

এই সাইটটি **দুইটি মোডে** চলতে পারে:

| মোড | বিবরণ |
|-----|-------|
| **DEMO_MODE = true** | সব ডাটা হার্ডকোড। API লাগবে না। |
| **DEMO_MODE = false** | আসল API (Contentful, Supabase, Cloudinary) |

---

### 🔄 মোড পরিবর্তন করতে

**ফাইল:** `src/lib/demo-mode.ts`

```typescript
// Demo মোড চালু রাখতে:
export const DEMO_MODE = true;

// Dynamic মোড চালু করতে:
export const DEMO_MODE = false;
```

---

### 🆕 নতুন ক্লায়েন্ট পেলে কী করবেন?

#### ধাপ ১: অ্যাকাউন্ট তৈরি করুন

1. **Supabase** - [supabase.com](https://supabase.com)
   - নতুন প্রজেক্ট তৈরি করুন
   - `orders` এবং `profiles` টেবিল তৈরি করুন (schema.sql দেখুন)

2. **Contentful** - [contentful.com](https://contentful.com)
   - নতুন স্পেস তৈরি করুন
   - Content types তৈরি করুন: `product`, `featuredOffer`, `lookbook`, `socialPost`

3. **Cloudinary** - [cloudinary.com](https://cloudinary.com)
   - নতুন অ্যাকাউন্ট বা environment তৈরি করুন

#### ধাপ ২: `.env.local` আপডেট করুন

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Contentful
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_DELIVERY_API_ACCESS_TOKEN=your-delivery-token
CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN=your-management-token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: Domain
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

#### ধাপ ৩: মোড পরিবর্তন করুন

`src/lib/demo-mode.ts` ফাইলে:

```typescript
export const DEMO_MODE = false; // এখন API ব্যবহার হবে
```

#### ধাপ ৪: ব্র্যান্ড কাস্টমাইজ করুন

**`src/lib/demo-mode.ts`** ফাইলে:

```typescript
export const BRAND_CONFIG = {
  name: "আপনার ব্র্যান্ড নাম",
  tagline: "আপনার ট্যাগলাইন",
  primaryColor: "#009B77", // প্রাইমারি কালার
  domain: "your-domain.com",
  // ...
};
```

---

### 🔐 ডেমো মোডে Admin Login

| ক্ষেত্র | মান |
|--------|-----|
| Email | যেকোনো |
| Password | `demo` অথবা `admin123` |

---

### 📁 গুরুত্বপূর্ণ ফাইল

| ফাইল | কাজ |
|------|-----|
| `src/lib/demo-mode.ts` | মোড টগল এবং ব্র্যান্ড কনফিগ |
| `src/data/products.ts` | হার্ডকোড প্রোডাক্ট |
| `src/data/demo-offers.ts` | ডেমো অফার |
| `src/data/demo-orders.ts` | মক অর্ডার |
| `src/lib/contentful.ts` | ডাটা ফেচিং (demo/dynamic) |
| `src/actions/orderActions.ts` | অর্ডার ম্যানেজমেন্ট |
| `src/middleware.ts` | রুট প্রটেকশন |

---

## 🇬🇧 English

### What is Demo Mode?

This site can run in **two modes**:

| Mode | Description |
|------|-------------|
| **DEMO_MODE = true** | All data is hardcoded. No APIs needed. |
| **DEMO_MODE = false** | Uses real APIs (Contentful, Supabase, Cloudinary) |

---

### 🔄 How to Switch Modes

**File:** `src/lib/demo-mode.ts`

```typescript
// For demo mode:
export const DEMO_MODE = true;

// For dynamic mode:
export const DEMO_MODE = false;
```

---

### 🆕 Setting Up a New Client

#### Step 1: Create Accounts

1. **Supabase** - [supabase.com](https://supabase.com)
   - Create a new project
   - Set up `orders` and `profiles` tables (see schema.sql)

2. **Contentful** - [contentful.com](https://contentful.com)
   - Create a new space
   - Set up content types: `product`, `featuredOffer`, `lookbook`, `socialPost`

3. **Cloudinary** - [cloudinary.com](https://cloudinary.com)
   - Create a new account or environment

#### Step 2: Update `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Contentful
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_DELIVERY_API_ACCESS_TOKEN=your-delivery-token
CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN=your-management-token

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional: Domain
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

#### Step 3: Switch Mode

In `src/lib/demo-mode.ts`:

```typescript
export const DEMO_MODE = false; // Now uses APIs
```

#### Step 4: Customize Brand

In `src/lib/demo-mode.ts`:

```typescript
export const BRAND_CONFIG = {
  name: "Your Brand Name",
  tagline: "Your Tagline",
  primaryColor: "#009B77",
  domain: "your-domain.com",
  // ...
};
```

---

### 🔐 Demo Mode Admin Login

| Field | Value |
|-------|-------|
| Email | Any email |
| Password | `demo` or `admin123` |

---

### 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/demo-mode.ts` | Mode toggle & brand config |
| `src/data/products.ts` | Hardcoded products |
| `src/data/demo-offers.ts` | Demo offers |
| `src/data/demo-orders.ts` | Mock orders |
| `src/lib/contentful.ts` | Data fetching (demo/dynamic) |
| `src/actions/orderActions.ts` | Order management |
| `src/middleware.ts` | Route protection |

---

### 🏷️ Code Markers

Look for these markers in the code:

- `🎯 DEMO MODE:` - Demo mode logic
- `[INTEGRATION POINT]` - Dynamic mode API calls
- `DEMO_MODE` checks - Conditional branches

---

## Quick Reference

```bash
# To run in demo mode (default)
npm run dev

# Test admin panel
# Go to: http://localhost:3000/admin/login
# Password: demo

# Test checkout
# Add products to cart and checkout
# Mock success page will show
```
