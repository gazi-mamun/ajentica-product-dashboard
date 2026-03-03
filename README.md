# Product Management Dashboard (for Ajentica)

React + TypeScript product dashboard for browsing, filtering, selecting, and favoriting products from local mock data.

## Run Locally

### Requirements

- Node.js (latest LTS recommended)
- npm

### Install and start

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

## Architecture

### Server state (TanStack Query)

- Source: local `public/products.json` via `fetch('/products.json')`
- Query library: TanStack Query
- Query policy (configured in `src/main.tsx`):
  - `staleTime: 60000` (60s)
  - `gcTime: 600000` (10m)
  - `refetchOnWindowFocus: false`

### Client state (Zustand + persist)

- Store: `src/store/favoritesStore.ts`
- Persist key: `pm-dashboard:v1`
- Persisted shape: IDs only
  - `favoriteIds: string[]`
  - `selectedIds: string[]`
- Actions: toggle favorite/selected and clear actions

### Performance strategy

- Virtualization:
  - Grid virtualized rows: `ProductVirtualGrid`
  - Table virtualized rows: `ProductVirtualTable`
- Deferred search:
  - Search filtering is debounced in `useProductDashboardState`
- Memoized derived data:
  - Filter/sort/category counts and ID lookup `Set`s
- Image handling:
  - Stable seeded image URLs from Picsum
  - Image fallback initials for failed images (`ProductImg`)

### UI styling and dependency strategy

- Styling: Tailwind CSS (utility-first approach with project-specific tokens/utilities in `src/index.css`)
- UI components: built with project-owned React components (no external UI component library)
- Utility helpers: small helpers are kept in-repo (`src/utils`) to avoid extra npm dependencies where practical

## Branch / Version Notes

- `snapshot/pagination-version`
  - Pagination-based rendering snapshot
- `perf/virtualization-biglist` (main working branch for big list performance)
  - Virtualized grid and table rendering for large datasets

Note on filter UI behavior:

- Filters are intentionally not sticky.
- Reason: in this UI, sticky filter controls reduce visible product area, especially on mobile.
- UX fallback: a floating "scroll to top" button is provided for quick return to filters.

## Challenge Checklist Mapping

Based on `CHALLENGE.md` requirements:

### A) Product display & discovery

- Fetch and display products:
  - Implemented with local JSON (`public/products.json`) and Query hook (`useProducts`)
- Product card details:
  - title, image, price, category shown in grid and table modes
- Search:
  - Search input filters by title and ID (debounced)
- Category filter:
  - Category chips with multi-select support + "All" reset
- Responsive layout:
  - Adaptive header/controls and responsive grid/table behavior

### B) Selection & management

- Favorite/select actions:
  - Implemented in both grid and table interactions
- Persistence after refresh:
  - Implemented via Zustand persist (`favoriteIds`, `selectedIds`)

### C) User experience

- Loading state:
  - Skeleton/loading component while fetching
- Error state:
  - Dedicated error UI with retry support
- Empty state:
  - Dedicated empty-result UI
- Desktop + mobile support:
  - Responsive classes and interaction flow for both sizes
