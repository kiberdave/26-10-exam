# 10X Shop — Final report

## Planned vs delivered

### CORE

| Requirement                                                        | Status |
| ------------------------------------------------------------------ | :----: |
| Vite + React + TS strict, Tailwind v4, typecheck / build = 0 errors | ✅ |
| Types for Product, ProductsResponse, Cart, Login, Checkout         | ✅ |
| Layout + Router: `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, `*` | ✅ |
| AuthContext + controlled Login with validation                     | ✅ |
| Guest on `/checkout` → `/login` → back to `/checkout`              | ✅ |
| Catalog with loading / error / empty states                         | ✅ |
| ProductCard + ProductGrid with `map` and stable keys               | ✅ |
| Product details, stock states, invalid id → 404                    | ✅ |
| CartContext: add / quantity / remove, immutable updates, badge     | ✅ |
| Cart page with totals and empty state                              | ✅ |
| Checkout controlled form + confirmation + cart reset               | ✅ |
| Responsive (375 px), hover / focus / disabled                      | ✅ |
| Error Boundary, DEBUG-LOG                                           | ✅ / _fill DEBUG-LOG_ |
| README, PLAN, REPORT, deploy, Git history                           | _deploy link_ |

### FULL

| Requirement                                                   | Status |
| ------------------------------------------------------------- | :----: |
| Search (debounce), category, sort, pagination, URL state      | ✅ |
| AbortController, skeletons, Retry                             | ✅ |
| Reviews + related products                                    | ✅ |
| `useReducer` cart, promo code `10X10`, shipping rule          | ✅ |
| Orders + status simulation + reorder, Profile                 | ✅ |
| Formik + Yup login                                            | ✅ |
| ApiClient, ApiError, Cart class, StorageService<T>, type guards | ✅ |
| `@theme`, dark mode, custom utilities                          | ✅ |
| Lazy routes and images                                         | ✅ |
| Lighthouse before / after, compatibility matrix               | _fill_ |

**Not done / out of scope:** sign-up and password recovery, real payment, infinite scroll, wishlist, price-range filter.

## Metrics

| Metric                         | Value |
| ------------------------------ | ----- |
| Main JS chunk (gzip)           | ~76 kB (target ≤ 250 kB) |
| Login chunk with Formik + Yup  | ~25 kB gzip, loaded only on `/login` |
| CSS (gzip)                     | ~7.5 kB |
| Commits / active days          | _fill_ |
| Hours spent                    | _fill per epic from PLAN.md_ |

### Lighthouse (deployed site, incognito, mobile preset)

| Metric          | Before | After | What changed |
| --------------- | -----: | ----: | ------------ |
| Performance     |        |       |              |
| Accessibility   |        |       |              |
| Best Practices  |        |       |              |
| CLS             |        |       |              |

Screenshots: `docs/lighthouse/before.png`, `docs/lighthouse/after.png`.

## Three hardest problems

1. _Problem — how it showed up — how it was solved._
2.
3.

## What I would do differently

-

## AI usage

_5–6 lines: what was delegated to AI, what was rejected and why, how the code was checked._
