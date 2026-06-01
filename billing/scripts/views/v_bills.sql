-- v_bills — list/read model for bills grid (no is_cancelled filter).

CREATE OR REPLACE VIEW v_bills AS
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
    b.office_mamul,
    b.tapal_mamul,
    b.diesel,
    b.others,
    b.total,
    b.is_cancelled,
    b.financial_year_id
FROM bills b
INNER JOIN location loc ON loc.location_id = b.from_id
INNER JOIN truck t ON t.truck_id = b.truck_id
INNER JOIN name_board nb ON nb.name_board_id = t.name_board_id
WHERE NOT b.is_deleted;
