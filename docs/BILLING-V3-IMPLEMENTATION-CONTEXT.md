# Billing v3 — implementation context (for new chats)

**Purpose:** Hands-on reference for what is **built today** (API + frontend + seeds), especially **screen metadata**, **DataTable**, and **master grids**.  
**Blueprint:** [`../BILLING-V3.md`](../BILLING-V3.md) · **Schema:** [`../dbdiagram.dbml`](../dbdiagram.dbml)

**Last updated:** 2026-05-26

---

## 1. Repo layout (current)

```
base-app/
├── BILLING-V3.md                          # Project blueprint (updated)
├── docs/BILLING-V3-IMPLEMENTATION-CONTEXT.md  # This file
├── dbdiagram.dbml
├── billing/                               # .NET 10 API (Billing.sln)
│   ├── src/{SharedKernel,Domain,Application,Infrastructure,Web.Api}
│   ├── scripts/                           # PostgreSQL seeds (per-table folders)
│   └── README.md
└── billing-frontend/                      # React 19 + Vite + shadcn
    └── src/
        ├── components/derived/data-table/   # Shared master grid
        ├── components/derived/data-table/column-cells/
        ├── pages/masters/                   # name-boards + trucks wired
        ├── hooks/useScreenSlice.ts
        └── store/screens/
```

---

## 2. Field naming convention (critical)

| Layer | Convention | Example |
|-------|------------|---------|
| PostgreSQL `app_entity_field.field_name` | **snake_case** | `owner_name`, `is_enabled` |
| C# domain / EF columns | snake_case in DB, PascalCase in code | `OwnerName` |
| List API JSON (DTOs) | **camelCase** | `ownerName`, `isEnabled` |
| Screen metadata API `fieldName` | **camelCase** (converted in API) | `ownerName` |

**Do not** convert field names on the frontend. The screen metadata endpoint converts once:

- `Application/Common/FieldNameConverter.cs` — `ToCamelCase` / `ToPascalCase`
- `Infrastructure/Repositories/AppEntityScreenRepository.cs` — applied to entity fields, grid columns, form fields after load

**Sorting:** UI sends camelCase `orderBy` (e.g. `ownerName asc`). Repositories normalize to PascalCase for Gridify via `Application/Common/Gridify/GridifyOrderByNormalizer.cs` (name boards, trucks).

---

## 3. Screen metadata flow

### API

- `GET /api/screens/by-menu/{menuCode}` — `[EndpointAccess("screens.get-by-menu")]`
- Handler: `Application/Registry/Screen/GetScreenByMenuCodeQuery`
- Repository: `AppEntityScreenRepository.GetMetadataByMenuCodeAsync`

### Frontend

1. Page calls `useScreenSlice(SCREEN_KEYS.nameBoard)` — sync mount via `ensureScreenSliceMounted()` (avoids “slice not mounted” on first render).
2. `useScreenMetadata(screenKey)` — TanStack Query loads metadata into Redux.
3. Wait for `metadata.status === succeeded` before rendering `DataTable` (column structure from metadata).
4. `mapScreenColumnsToDataTableColumns(getPrimaryEntityColumns(metadata.entities))` → `DataTable` `columns` prop.

### Menu codes (singular)

| Screen | `menu_code` | `SCREEN_KEYS` | Page |
|--------|-------------|---------------|------|
| Name boards | `name_board` | `nameBoard` | `pages/masters/name-boards/index.tsx` |
| Trucks | `truck` | `truck` | `pages/masters/trucks/index.tsx` |

---

## 4. `app_entity_screen_column` conventions

### Column width (`column_width_percent`)

- Base grid width = **100**.
- Actions column has its own percent (e.g. **12**); `column_component = 'actions'`.
- **Data budget** = `100 - actionsPercent`.
- If sum of visible data column percents **≤ data budget** → split data budget **equally** among visible columns; table width stays 100%.
- If sum **>** data budget → use configured percents; table width grows (horizontal scroll).

Implementation: `billing-frontend/src/components/derived/data-table/dt-column-layout.ts` — `computeDataTableLayout()`.

### Actions column (in metadata, not a React prop width)

- Seed `_actions` on `app_entity_field` + screen column row.
- `column_component = 'actions'`, `is_pinned = true`, high `display_order` (e.g. 999).
- Page provides `renderActionsColumn={({ row, rowId, mutations }) => …}`.
- Excluded from column picker; always sticky right when renderer provided.

### State columns (`is_enabled`, `is_active`)

**Not grid columns.** Used for:

- `isEnabled` — enable/disable toggle in action buttons (row DTO).
- `isActive` — soft-delete; inactive rows styled muted (`inactiveDataTableRowClassName`).

Registry:

- `is_visible = false` in SQL seeds.
- Excluded from column picker via `isDisplayableGridColumn()` (`column.visible` from metadata).
- Metadata `fieldName`: `isEnabled`, `isActive` (camelCase from API).

### `column_component` → cell renderer

Registry: `column-cells/registry.ts`. Keys match metadata (lowercase).

| `column_component` | Component | Notes |
|--------------------|-----------|--------|
| `text` | `DefaultCell` | Default; truncate + popover if overflow |
| `badge` | `BadgeCell` | Codes, ALL CAPS |
| `mobile`, `phone` | `MobileCell` | `+91 XXX XXX XXXX`, JetBrains Mono |
| `vehicle_number`, `truck_number` | `VehicleNumberCell` | `KA 01 AB 1234` style |
| `boolean` | `BooleanCell` | Yes/No badges |
| `date` | `DateCell` | `en-IN` short date |
| `currency` | `CurrencyCell` | INR only |
| `actions` | (page `renderActionsColumn`) | Not a data cell |

Overflow: `column-cells/dt-cell-overflow.tsx` — ellipsis + click popover for full text.

### Current seed mapping (re-run seeds after changes)

**name_boards:** `code`→`badge`, `owner_phone`→`mobile`  
**trucks:** `truck_number`→`vehicle_number`

---

## 5. DataTable architecture (frontend)

**Location:** `billing-frontend/src/components/derived/data-table/`

### State split (hybrid)

| State | Where | Contents |
|-------|--------|----------|
| **Screen slice** (`table`) | Redux per screen | `page`, `pageSize`, `sort`, `filter.global`, `selectedIds` |
| **UI / wiring** | Zustand per `DataTable` instance | `columnVisibility`, `columnFilters`, `showColumnSearch`, query runtime |

`DataTableProvider` syncs Redux `value` / `onChange` and runs list query + mutations.

### Layout (wireframe)

- `DtHeader` — title + `headerActions` (e.g. Add)
- `DtToolbar` — column picker + column search toggle (left); global search (right)
- Header row — sort indicators; widths from `computeDataTableLayout`
- Optional `DtColumnFilters` row — per-column client-side filter (`Input` with `px-2`)
- Body — skeleton rows while `isLoading`; full column structure before data loads
- `DtPagination`

### List query

- `dataTableStateToListQueryParams()` → `page`, `pageSize`, `filter`, `orderBy`
- Global filter: plain text → API; backend `GridifyListFilter.Normalize` wraps as `search=*value` for composite search field.
- `enabled={metadataReady}` — structure from metadata; query only when metadata loaded.

### Key exports

```ts
import {
  DataTable,
  mapScreenColumnsToDataTableColumns,
  getPrimaryEntityColumns,
  createInitialDataTableState,
} from '@/components/derived/data-table';
```

### Example page pattern (Name Boards)

```tsx
useScreenSlice(SCREEN_KEYS.nameBoard);
const table = useScreenTableSelector(SCREEN_KEYS.nameBoard);
const { metadata } = useScreenMetadata(SCREEN_KEYS.nameBoard);

const columns = useMemo(
  () => mapScreenColumnsToDataTableColumns(getPrimaryEntityColumns(metadata.entities)),
  [metadata.entities],
);

if (metadata.status !== SCREEN_METADATA_LOAD_STATUS.succeeded) {
  return <p>Loading screen…</p>;
}

return (
  <DataTable<NameBoardDto>
    value={table}
    onChange={(next) => dispatch(nameBoardsScreenActions.setTable(next))}
    queryOptions={listNameBoardsQueryOptions}
    enabled={true}
    columns={columns}
    rowId={(row) => row.nameBoardId}
    renderActionsColumn={({ rowId, mutations }) => (/* … */)}
  />
);
```

---

## 6. Database seeds (order)

See `billing/scripts/README.md`. Summary:

1. Menus → `app_menu/seed_billing_menus.sql`
2. Entity registry → `app_field_data_type`, `app_entity`, `app_entity_field/*.sql`
3. Screens → `app_entity_screen/insert.sql`, `app_entity_screen_column/*.sql`, `app_entity_screen_field/*.sql`
4. Endpoints + role grants

**Migrations:** EF only; auto-apply in Development (`Program.cs` → `ApplyMigrations()`).  
**Important:** Designer `.cs` required for each migration or EF won’t discover it.

**Maintenance scripts:**

- `app_entity_screen_column/migrate_column_width_percent.sql`
- `app_entity_screen_column/migrate_hide_state_columns.sql` — `is_visible = false` for `is_enabled` / `is_active`

---

## 7. API masters (implemented)

| Entity | Controller | List filter/sort |
|--------|------------|------------------|
| Name boards | `NameBoardsController` | Gridify + `MasterGridifyMappers.NameBoard` |
| Trucks | `TrucksController` | Gridify |

DTOs: camelCase JSON (`NameBoardDto.ownerName`, etc.).

---

## 8. Common pitfalls

1. **Slice not mounted** — call `ensureScreenSliceMounted` in render path before selectors, not only `useLayoutEffect`.
2. **Actions-only column while loading** — ensure metadata loaded before `DataTable`; skeleton rows for data loading only.
3. **Column search on wrong key** — metadata must return camelCase `fieldName`; row access is `row[column.fieldName]`.
4. **Gridify filter** — don’t send raw `filter=smr`; use global search or valid Gridify expressions.
5. **Re-seed after SQL changes** — screen column scripts use `ON CONFLICT DO UPDATE`.

---

## 9. Next work (suggested)

- Server-side column filters (today: client-side on current page rows only).
- Form screens from `app_entity_screen_field` metadata.
- Unit tests for `computeDataTableLayout` and `FieldNameConverter`.

---

## 10. File index (quick open)

| Topic | Path |
|-------|------|
| DataTable main | `billing-frontend/.../data-table/dt-table.tsx` |
| Column layout math | `billing-frontend/.../data-table/dt-column-layout.ts` |
| Cell registry | `billing-frontend/.../column-cells/registry.ts` |
| Screen slice mount | `billing-frontend/src/hooks/useScreenSlice.ts` |
| Field name API conversion | `billing/src/Application/Common/FieldNameConverter.cs` |
| Screen metadata repo | `billing/src/Infrastructure/Repositories/AppEntityScreenRepository.cs` |
| Gridify filter normalize | `billing/src/Infrastructure/Gridify/GridifyListFilter.cs` |
| Name board columns seed | `billing/scripts/app_entity_screen_column/name_boards.sql` |
| Name boards page | `billing-frontend/src/pages/masters/name-boards/index.tsx` |
