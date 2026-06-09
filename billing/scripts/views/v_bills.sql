-- v_bills — list/read model for bills grid (no is_cancelled filter).
-- Requires public.bill_others_total() — run scripts/functions/bill_others_total.sql first.

CREATE OR REPLACE VIEW public.v_bills AS
SELECT
    b.bill_id,
    b.bill_number,
    b.bill_date,
    b.from_id,
    loc.name AS from_location_name,
    b.truck_id,
    t.truck_number,
    nb.name AS name_board_name,
    nb.owner_name,
    nb.owner_phone AS owner_mobile,
    b.driver_name,
    b.driver_mobile,
    b.total_freight,
    b.commission,
    b.crossing,
    b.hand_loan,
    b.truck_loan,
    b.pay_by,
    b.paid_name,
    b.paid_mobile,
    b.office_mamul,
    b.tapal_mamul,
    b.diesel,
    public.bill_others_total(b.others) AS others,
    b.total,
    b.is_cancelled,
    b.financial_year_id
FROM public.bills b
INNER JOIN public.location loc ON loc.location_id = b.from_id
INNER JOIN public.truck t ON t.truck_id = b.truck_id
INNER JOIN public.name_board nb ON nb.name_board_id = t.name_board_id
WHERE NOT b.is_deleted;
