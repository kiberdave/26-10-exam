# 10X Shop — Project Plan

## Goal

Build a working online store SPA (React + TypeScript + Tailwind CSS v4, DummyJSON API) that covers every CORE requirement of the PRD, then add FULL features in priority order, deploy it and document the process.

**Hard deadlines:** theory test — 5 Nov · repository submission — 6 Nov, 23:59 · defense — 7–8 Nov.

## Scope

| Module        | CORE (must)                                                                 | FULL (if time allows, in this order)                                   |
| ------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| React         | Components, props/children, useState/useEffect, map/key, Router, Context, controlled Login & Checkout, cart | Custom hooks, `useReducer` cart, Formik + Yup login, Orders, Profile |
| TypeScript    | Strict mode, typed props/state/API, typecheck = 0 errors                    | Generics, ApiClient/ApiError, OOP classes, type guards, unions        |
| Tailwind CSS  | v4 integration, utilities, flex/grid, responsive, hover/focus/disabled      | `@theme` tokens, dark mode, custom utilities                           |
| Optimization  | Responsive pages, Error Boundary, DEBUG-LOG, basic debugging                | Lazy routes, lazy images, Lighthouse before/after                      |
| Process       | README, PLAN, REPORT, deploy, real Git history                              | Progress notes, issues / PR flow                                       |

## Work breakdown (WBS)

Estimates are in hours.

| Epic      | Task                                                                 | Est. | Level |
| --------- | -------------------------------------------------------------------- | ---: | ----- |
| Setup     | Vite + React + TS (strict), Tailwind v4, ESLint, scripts, folders    | 2    | CORE  |
| Setup     | Types: Product, ProductsResponse, CartItem/CartState, login, checkout | 1    | CORE  |
| Layout    | Router, Layout (Header + Outlet + Footer), NavLink, 404, ScrollToTop | 2    | CORE  |
| Auth      | AuthContext, Login controlled form, ProtectedRoute for /checkout     | 2    | CORE  |
| Catalog   | Fetch products, loading/error/empty, ProductCard, ProductGrid        | 3    | CORE  |
| Product   | Details page, gallery, stock states, quantity, Add to cart, 404 ids  | 3    | CORE  |
| Cart      | CartContext, add / quantity / remove, totals, cart page, badge       | 3    | CORE  |
| Checkout  | 4-field controlled form, validation, confirmation, clear cart        | 2    | CORE  |
| Quality   | Responsive pass (375 px), hover/focus/disabled, Error Boundary        | 2    | CORE  |
| Docs      | README (EN), REPORT, DEBUG-LOG, deploy + SPA rewrite                 | 3    | CORE  |
| Catalog   | Search + debounce, category, sort, pagination, URL state, abort      | 4    | FULL  |
| Cart      | `useReducer`, promo code, shipping rule, `Cart` class                | 2    | FULL  |
| Product   | Reviews (form + list + average), related products                    | 3    | FULL  |
| TS        | ApiClient / ApiError, StorageService<T>, type guards                 | 2    | FULL  |
| Orders    | Orders list + details, status simulation, reorder                    | 3    | FULL  |
| Profile   | Profile form, theme, clear local data                                | 2    | FULL  |
| UI        | Theme (dark mode), toasts, skeletons, Formik + Yup login             | 3    | FULL  |
| Perf      | Lazy routes, lazy images, Lighthouse before/after, compatibility     | 2    | FULL  |
|           | **Total**                                                            | **44** |     |

## Schedule

| Days       | Focus                                                                 |
| ---------- | --------------------------------------------------------------------- |
| 1–2 Nov    | Setup, types, layout and routing, auth, catalog, product page         |
| 3 Nov      | Cart, checkout, CORE flow test, first deploy                          |
| 4 Nov      | FULL: catalog filters + URL state, reducer + promo, reviews, related  |
| 5 Nov      | Theory test. FULL: orders, profile, theme, Formik login               |
| 6 Nov      | Lighthouse, compatibility, docs, final QA, submit before 23:59        |
| 7–8 Nov    | Defense                                                               |

## Risks

| Risk                                              | Mitigation                                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| DummyJSON is slow or down during the demo         | Clear error state with Retry; API base URL is configurable (`VITE_API_BASE_URL`) to switch to a local mock |
| Running out of time before the deadline           | CORE first, deploy after CORE; every FULL feature is optional and isolated |
| Refreshing a deep link on the host returns 404    | `vercel.json` / `netlify.toml` SPA rewrite, tested on `/products/5`         |
| Not being able to explain AI-assisted code        | Review every file before committing it; note the reasons in DEBUG-LOG and REPORT |
| Broken data in `localStorage` crashes the app     | Read storage only through `StorageService` with type guards                 |

## Definition of Done

A task is done when:

1. It works in the browser on desktop and at 375 px without horizontal scroll.
2. `npm run typecheck`, `npm run lint` and `npm run build` pass with 0 errors.
3. Loading, error and empty states are handled where data is loaded.
4. Interactive elements have hover and visible focus styles; form fields have labels.
5. It is committed with a meaningful message (`feat:`, `fix:`, `refactor:`, `docs:` …).
