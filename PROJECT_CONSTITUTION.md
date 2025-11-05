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
