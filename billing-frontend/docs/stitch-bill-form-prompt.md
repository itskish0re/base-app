# Stitch AI Prompt — Bill Form Layout (Create / Edit)

## Project context

Design a **Create / Edit Bill** screen for a **B2B trucking & freight billing web app** used by transport operators in India. Users enter a **truck memo / lorry receipt (bill)** with up to **3 load lines**, charges, and payment details. The printed output is a formal A4 memo (preview is separate; see below). Users work quickly on desktop in the office and on mobile at the yard.

**Screen goal:** dense but scannable data entry with clear section hierarchy, minimal scrolling confusion, and fast access to **Preview**, **Cancel**, and **Save**.

---

## Design system (must follow)

### Stack & style

- React admin UI using **shadcn/ui** (`base-vega` style), **Tailwind CSS**, **Lucide** icons
- Semantic tokens via CSS variables (OKLCH), not hard-coded hex
- **Border radius:** `0.5rem` base (`rounded-lg` for cards/sections)
- **Light theme primary:** warm orange/coral accent (`oklch(0.6171 0.1375 39.0427)`)
- **Neutrals:** warm off-white background, soft gray borders, muted secondary text
- **Typography:**
  - Body: **Inter** (400–700)
  - Headings: medium weight, compact (`text-sm` section titles, `text-lg`/`text-xl` page title)
  - Numbers: tabular where possible; Indian locale formatting (`en-IN`)
  - Mono (optional): JetBrains Mono for IDs/codes only

### Components to use visually

- Text inputs (`h-9`, subtle border, focus ring in primary color)
- Searchable lookup comboboxes (party, location, truck, goods, unit)
- Date picker
- Segmented control / pill toggle group (3 options: UPI | Cash | Owner)
- Toggle switch (truck loan, cancelled, “as per bill”)
- Outline / primary buttons, ghost icon buttons (delete line)
- Cards: `rounded-lg border bg-card shadow-sm` for repeatable blocks
- Read-only fields: `bg-muted/50`, no strong border emphasis
- Error text: destructive color, `text-sm`
- Sheet / drawer for preview (desktop: right 50% width; mobile: bottom sheet)

### Visual tone

- Professional, operational, not marketing-heavy
- Clear labels, restrained color, orange only for primary actions and focus
- Section titles: `text-sm font-semibold`; sublabels: `text-xs font-medium text-muted-foreground`

---

## Page shell (outside the form card)

### Header row

- Title: “Create bill” or “Edit bill — {bill number}”
- Subtitle: “Fill in the bill details below. Open Preview to see the memo.”
- Actions (desktop, top-right): **Preview** (outline, eye icon), **Cancel** (outline), **Save bill** (primary)

### Mobile actions

- Same 3 buttons in a **fixed bottom bar** (full width, equal flex, backdrop blur, top border)
- Main content needs bottom padding so fields aren’t hidden behind the bar

### Main content area

- Single scrollable column inside a bordered container (`rounded-lg border bg-background p-3 sm:p-4`)
- **No inline preview** on the page — preview opens in a **sheet** on button click

### Preview sheet

- Desktop: slides from **right**, **50% viewport width**, full height
- Mobile: slides from **bottom**, max ~92vh, rounded top corners
- Contains zoom/pan A4 memo preview (treat as embedded panel with toolbar — design chrome only)

---

## Form structure (top → bottom)

### Section 1 — Bill header

Two responsive grids (`sm:grid-cols-2`, gap-3).

| Field | Type | Notes |
|--------|------|--------|
| Bill number | Text | Required; read-only in edit mode |
| Bill date | Date picker | Required |
| From | Location lookup | Required |
| Truck | Truck lookup | Required; selecting truck auto-fills owner/name board (read-only below) |
| Name board | Text | Read-only |
| Owner name | Text | Read-only |
| Owner mobile | Text | Read-only |
| Driver name | Text | Required |
| Driver mobile 1 | Text | Optional |
| Driver mobile 2 | Text | Optional |

Group truck-derived read-only fields visually (muted block) so users know they’re auto-filled.

---

### Section 2 — Loads (repeatable, max 3 lines)

Section header: **Loads** + **Add line** (outline, small, disabled at 3 lines).

Each load is a **card** with:

- Line label “Line 1/2/3” + trash icon (ghost, disabled if only one line)

**Row A — lookups (2 columns on sm+)**

- Consignor (required)
- Consignee (required unless “As per bill” is on)
- To / destination (required)
- **As per bill** switch (when on, consignee disabled/cleared)
- Goods (required)
- Unit (required)

**Row B — amounts (3 columns on sm+)**

- Weight / Qty (editable, default 0)
- Rate per unit (editable, default 0)
- Freight (read-only, calculated)
- Advance (editable, default 0)
- To pay (editable, default 0)
- Balance (read-only, calculated)

**Business rules (affect layout hints)**

- Fixed unit: freight = rate × 1
- Other units: freight = rate × weight/qty
- Balance = freight − advance − to pay
- Show calculated fields as read-only with muted background

---

### Section 3 — Charges & totals

Section title: **Charges & totals**

**Desktop (xl): 3-column intent**

- Column 1: Payment + Advance summary (stacked)
- Columns 2–3: Charges table + Other charges

**Tablet (md): 2 columns**

- Payment + summary stack in first column span
- Charges + others span full width below or beside

**Mobile: single column** — Payment → Advance summary (if visible) → Charges → Other charges

#### Payment panel

- Segmented control: **UPI | Cash | Owner** (default **UPI** selected)
- When **UPI**: show table with Paid name* and Paid mobile* (required)
- When Cash/Owner: short helper text (“Name and mobile only required for UPI”)

#### Advance summary (conditional)

- Only when total advance > 0
- Small table: Advance | Commission | Balance (read-only summary, not editable)

#### Charges table

Bordered table, label left / value right:

| Row | Editable? |
|-----|-----------|
| Total freight | Read-only (sum of load freights) |
| Commission | Read-only (2% of total freight) |
| Crossing | Editable (default 0) |
| Hand loan | Editable (default 0) |
| Office mamul | Editable (default 0) |
| Tapal mamul | Editable (default 0) |
| Diesel | Editable (default 0) |
| Total | Read-only (calculated) |
| Truck loan | Toggle switch |

**Truck loan UX**

- Enabled only when **total advance across loads = 0**
- When disabled: switch off + helper “Disabled when advance is entered”
- When enabled and on: memo shows bill total in truck loan area (preview only)

#### Other charges

- Repeatable key/value rows + “Add other”
- Default one empty row (key blank, value 0)

#### Footer of section

- **Cancelled** switch

---

## Business logic summary (for layout/state hints)

- Many fields auto-calculate; distinguish **editable** vs **computed/read-only** clearly
- Commission is always 2% of total freight (never manual)
- Total = total freight + commission + crossing + office mamul + tapal mamul + diesel + other charges − hand loan
- Payment default: UPI
- Numeric defaults: 0 for amounts
- Truck selection cascades owner/name board fields
- Form validates before save (required header, at least one complete load line, UPI paid name/mobile)

---

## Responsiveness requirements

| Breakpoint | Layout behavior |
|------------|-----------------|
| **Mobile (<640px)** | Single column; stacked fields; fixed bottom action bar; preview bottom sheet |
| **sm (≥640px)** | 2-column grids in header/loads; actions move to page header |
| **md (≥768px)** | Charges area begins 2-column grid |
| **xl (≥1280px)** | Charges: payment/summary narrow left column; charges + others wider right |

### Mobile UX priorities

- Touch targets ≥44px for switches and segment buttons
- Avoid horizontal scroll except intentional tables (charges, payment sub-table)
- Load cards should feel like discrete steps (clear separation between lines)
- Keep Preview reachable without scrolling to top (bottom bar)

### Desktop UX priorities

- See more fields per row to reduce vertical scroll
- Actions always visible in header (no bottom bar)
- Preview sheet at 50% width so form remains partially visible behind overlay

---

## Accessibility & polish

- Required fields marked with asterisk
- `aria-label` on segmented payment control
- Clear focus states (ring in primary color)
- Loading state: skeleton placeholders in form area
- Inline validation errors below fields / top of form for save failures
- Destructive styling for errors only

---

## Out of scope for this Stitch task

- Do **not** redesign the **printed A4 memo** layout (logo, tables, disclaimer, signatures) — only the **preview sheet chrome** (toolbar area + container)
- Do **not** redesign app sidebar/navigation — assume form sits in main content area next to existing sidebar on desktop

---

## Deliverables requested from Stitch

1. **Desktop layout** (1440px) — full page with sidebar placeholder
2. **Mobile layout** (390px) — with bottom action bar and one load line expanded
3. **Tablet layout** (768px) — intermediate charges section
4. Component-level specs: spacing, card padding, section gaps, table density
5. States: default create form, UPI selected, truck loan enabled, advance summary visible, validation error, preview sheet open (desktop + mobile)

**Design for implementation in shadcn/ui + Tailwind** — use existing token names (background, foreground, primary, muted, border, card, destructive) and component patterns above.
