# 10X Shop

An online store SPA built with React 19, TypeScript (strict) and Tailwind CSS v4 on top of the public [DummyJSON](https://dummyjson.com) products API. Shoppers can search and filter the catalog, compare prices and discounts, collect products in a cart, check out with a validated form and follow their orders.

Login, checkout and orders are simulated locally: no real authentication, payment or server-side orders. This is the graduation project of the 10X Academy front-end course.

**Live demo:** _add the Vercel / Netlify link here_

## Features

### CORE

- Catalog loaded from `GET /products` with loading, error and empty states
- Product cards with discounted price, discount badge, rating and stock status
- Product details page (`/products/:id`) with gallery, quantity stepper and Add to cart; unknown or invalid ids show a 404 page
- Shared cart (React Context): add, change quantity, remove, clear, subtotal / total, header badge
- Local login (React Context) with a controlled form and validation; guests opening `/checkout` are sent to `/login` and come back after logging in
- Checkout with four controlled fields, validation, "Thank you!" confirmation and cart reset
- React Router with one shared layout, active links, 404 route and scroll-to-top on navigation
- Responsive layout (375 px → desktop) with hover, focus and disabled states
- Error Boundary with a "Something went wrong." fallback

### FULL

- Search with 400 ms debounce, category filter, 5 sort options and pagination — all stored in the URL (`?q=&category=&sort=&page=`), so refresh, Back / Forward and shared links keep the view
- Request cancellation with `AbortController` (no stale responses), skeleton loading, Retry button
- Reviews tab: local reviews with validation, combined average rating
- Related products (same category, reusing `ProductCard`)
- Cart with `useReducer`, discriminated-union actions and exhaustive `never` check; promo code `10X10` (−10%); free shipping from $100
- Orders history (`/orders`, `/orders/:id`) with status simulation (Processing → Shipped → Delivered) and Reorder
- Profile page: editable details, theme switch, clear local data, log out
- Dark / light theme stored in `localStorage`, no flash on load
- Toast notifications
- Login form built with Formik + Yup
- Typed `ApiClient` / `ApiError` classes, generic `StorageService<T>`, `Cart` class, type guards for everything read from `localStorage`
- Route-level code splitting with `React.lazy` + `Suspense`, lazy images with fixed dimensions

## Tech stack

| Area      | Tools                                                      |
| --------- | ---------------------------------------------------------- |
| UI        | React 19, React Router 7                                   |
| Language  | TypeScript 6 (`strict`, no `any`)                          |
| Styling   | Tailwind CSS v4 (`@tailwindcss/vite`, `@theme`, `@utility`, custom `dark` variant) |
| Forms     | Controlled inputs + `useState`; Formik + Yup for Login     |
| Data      | DummyJSON REST API via `fetch`                             |
| Tooling   | Vite 8, ESLint 10 + typescript-eslint + react-hooks        |
| Hosting   | Vercel or Netlify (SPA rewrite included for both)          |

## Architecture

```
src/
├── api/          ApiClient (typed fetch wrapper), ApiError, product endpoints
├── types/        Domain models: product, cart, order, user, api (AsyncState, SortOption)
├── models/       Business logic without UI: Cart (totals), order helpers, StorageService<T>
├── context/      React Contexts + Providers: Auth, Cart (+ reducer), Theme, Toast
├── hooks/        Custom hooks: useFetch, useDebounce, useLocalStorage, useAddToCart, useNow…
├── components/
│   ├── layout/   Layout, Header, Footer, ErrorBoundary, NotFound, ScrollToTop, ThemeToggle
│   ├── ui/       Button, TextField, PriceTag, StockBadge, QuantityStepper, EmptyState…
│   ├── catalog/  CatalogToolbar (search / category / sort), Pagination
│   ├── product/  ProductCard, ProductGrid, ProductDetails, Gallery, Tabs, Reviews, Related
│   ├── cart/     CartLine, CartSummary, PromoCodeForm
│   └── orders/   OrderStatusBadge, OrderTimeline
├── pages/        One component per route (lazy-loaded except the catalog)
├── routes/       AppRoutes (all routes), ProtectedRoute (login redirect)
└── utils/        Pure helpers: formatting, validation, URL params, type guards, constants
```

**Data flow.** The catalog reads its filters from the URL, turns them into a DummyJSON path and loads it with the generic `useFetch<T>` hook, which cancels outdated requests in its effect cleanup. User actions call event handlers that update state through Context functions (`addItem`, `login`, `toggleTheme`); the cart reducer always returns new objects (immutable updates) and React re-renders every component that reads that context, such as the header badge. Side effects — saving the cart, user and theme to `localStorage`, updating `<html data-theme>` — run in `useEffect` after the state changes.

## How to run

Requires Node.js 20.19+ (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
```

Production check (the same commands the evaluators run):

```bash
npm install && npm run typecheck && npm run build
npm run preview    # serves dist/ at http://localhost:4173
```

## Scripts

| Script              | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                             |
| `npm run build`     | Type-check the project and build `dist/`              |
| `npm run preview`   | Serve the production build locally                    |
| `npm run typecheck` | `tsc --noEmit` for the app and the Vite config        |
| `npm run lint`      | ESLint (`no-explicit-any`, hooks rules, no `console.log`) |

## Test account

Login is local, so any username works with any password of 6+ characters, for example:

- Username: `emilys`
- Password: `emilyspass`

Promo code for the cart: `10X10`.

## Demo tips

- Add `?crash` to any URL (e.g. `/cart?crash`) to throw an error inside the page and see the Error Boundary fallback.
- Place an order, then open **Orders**: the status moves from Processing to Shipped after 1 minute and to Delivered after 3, without a reload.
- Try `/products/999999` or `/products/abc` for the not-found page.

## Deployment

- **Vercel:** import the repository; `vercel.json` rewrites every path to `index.html`.
- **Netlify:** import the repository; `netlify.toml` sets the build command, `dist` and the SPA redirect.

Without the rewrite, refreshing `/products/5` on the live site would return the host's 404, because only `index.html` exists on the server.

## Project documents

- [PLAN.md](PLAN.md) — goals, work breakdown, risks
- [REPORT.md](REPORT.md) — planned vs delivered, metrics, lessons
- [DEBUG-LOG.md](DEBUG-LOG.md) — bugs found and how they were fixed
- [COMPATIBILITY.md](COMPATIBILITY.md) — browser and device checks

## Credits

- Product data and images: [DummyJSON](https://dummyjson.com)
- Typeface: [Archivo](https://fonts.google.com/specimen/Archivo) (Google Fonts)
- Course: 10X Academy front-end program
- AI assistance: see the AI section in [REPORT.md](REPORT.md)
