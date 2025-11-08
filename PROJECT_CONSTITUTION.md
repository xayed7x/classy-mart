# Project Constitution: Classy Mart

This document outlines the core architectural principles and conventions for the Classy Mart project. Adhering to these guidelines is crucial for maintaining a scalable, performant, and maintainable codebase.

## 1. Core Principles

- **Performance First:** Prioritize fast load times and a smooth user experience.
- **Server-Centric Data Fetching:** Fetch data on the server whenever possible to ensure freshness and reduce client-side complexity.
- **Consistency is Key:** Adhere to established patterns and conventions throughout the codebase.
- **Dynamic Over Static for E-commerce:** The dynamic nature of our inventory, orders, and user data requires a server-rendered approach, not a static export.

## 2. Architectural Decisions

### 2.1. Rendering and Data Fetching Strategy

**Primary Strategy: Server-Side Rendering (SSR) with Direct Database Access**

To ensure data freshness and eliminate caching-related bugs, all data-intensive pages (especially within the admin panel) **must** be implemented as async Server Components.

- **Pattern:** Pages should be async components that directly query the database (e.g., Supabase) on the server.
- **Implementation:** Use `export const dynamic = 'force-dynamic'` and `export const revalidate = 0` at the page level to enforce per-request rendering and prevent caching.

**Rationale:**

This approach was adopted after diagnosing a critical caching issue on the Admin Orders page. The previous architecture, which used client-side `fetch` calls to an API route, was prone to serving stale data due to multiple caching layers (browser, CDN).

By fetching data directly on the server during the rendering process, we:
1.  Bypass all intermediate caching layers.
2.  Ensure the user always sees the most up-to-date information.
3.  Simplify the architecture by removing the need for client-side data fetching logic and separate API routes for simple data retrieval.

**When to use Client-Side Rendering (CSR):**

CSR should be limited to components that require heavy user interactivity and do not rely on frequently changing data.

### 2.2. Deployment

The project is configured for a dynamic, server-rendered deployment. The `next.config.js` file is set to `output: 'standalone'` to produce a self-contained Node.js server, not a static export. This is non-negotiable for our application's architecture.

## 3. The "Golden Rule" of Production Caching
### Rule 0 (The "Nuclear Option" / Golden Pattern for Admin Panels): Direct-to-Database from the Client

**For any critical, interactive admin page that MUST display real-time data (e.g., Orders, Products), the primary architectural choice is a Client-Side Rendered (CSR) component that fetches data DIRECTLY from the Supabase JS client.**

-   **Rationale:** This pattern has proven to be the only 100% reliable method to defeat all layers of unpredictable production caching on Netlify (Next.js data cache, server cache, CDN cache).
-   **Implementation:**
    -   The page MUST be a `"use client"` component.
    -   It MUST NOT use an internal API route (`/api/...`).
    -   It MUST use the client-side Supabase JS library (`import { createClient } from '@/lib/supabase/client'`) inside a `useEffect` hook to fetch its data.
    -   Security is ensured by Supabase's Row Level Security (RLS) policies, which are configured to only allow users with the `'admin'` role to read the data.
-   *This pattern supersedes Rules A, B, C, and D for admin panel pages where absolute data freshness is non-negotiable.*

## 6. Architectural Decision Records (ADR)

### ADR-001: Admin Panel Caching Strategy

-   **Status:** Decided
-   **Context:** Throughout the project, we faced a persistent production bug where admin panel pages (`/admin/orders`, `/admin/products`) served stale data on Netlify, despite the correct implementation of standard Next.js revalidation features (`revalidatePath`, `force-dynamic`, `cache: 'no-store'`). New orders and products were not appearing without a new deployment.
-   **Decision:** We have made the definitive architectural decision to **abandon all server-side rendering and intermediate API routes for critical admin list pages.** The final, successful architecture is a pure CSR pattern where the client component communicates directly with the Supabase database via the Supabase JS SDK.
-   **Consequences:**
    -   **Pros:** 100% guaranteed data freshness in any production environment. Simpler codebase with fewer layers (no API routes for these pages). Security is robustly handled by Supabase RLS.
    -   **Cons:** Minor increase in client-side load. Exposes database query structure in the browser (deemed an acceptable risk for this internal tool due to strong RLS).

### ADR-002: Checkout Form and UI Enhancements

-   **Status:** Implemented
-   **Context:** The checkout page required several updates to improve user experience and simplify the form. The email field was mandatory, the "division" field was redundant, the mobile back button was broken, and color swatches had inconsistent styling.
-   **Decision:**
    1.  The email field on the checkout page was made optional to reduce friction during checkout. The backend was updated to handle `null` email values.
    2.  The "division" field was removed from the checkout form and the backend logic to simplify the address input.
    3.  The mobile back button on the checkout page was fixed to point to the homepage (`/`) instead of a non-existent `/products` page.
    4.  The border style of color swatches was standardized across the application (checkout page, cart drawer, product details) to match the product card's border for a consistent UI.
-   **Consequences:**
    -   **Pros:** Improved user experience during checkout, a cleaner and more consistent UI, and a more streamlined address form.
    -   **Cons:** None.