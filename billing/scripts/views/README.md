# Database views (transactions)

Apply **after** EF migrations create `bills` and `loads` tables.

## Required views

| View | Script |
|------|--------|
| `v_bills` | `v_bills.sql` |
| `v_loads` | `v_loads.sql` |

The API validates these exist on startup (`BillingViews.Required`).

```bash
CONN="<connection-string>"
psql "$CONN" -f scripts/views/v_bills.sql
psql "$CONN" -f scripts/views/v_loads.sql
```

Or run the one-shot temp seeds under `scripts/temp/` after migration.
