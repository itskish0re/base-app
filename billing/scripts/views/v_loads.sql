-- v_loads — list/read model for loads grid (active lines only).

CREATE OR REPLACE VIEW v_loads AS
SELECT
    l.load_id,
    l.bill_id,
    b.bill_number,
    l.load_number,
    l.consignor_id,
    consignor.name AS consignor_name,
    l.consignee_id,
    consignee.name AS consignee_name,
    l.as_per_bill,
    l.to_id,
    loc.name AS to_location_name,
    l.goods_id,
    g.name AS goods_name,
    l.unit_id,
    u.name AS unit_name,
    l.weight_or_quantity,
    l.rate_per_unit,
    l.freight,
    l.advance,
    l.topay,
    l.balance,
    l.is_active,
    l.financial_year_id
FROM loads l
INNER JOIN bills b ON b.bill_id = l.bill_id
INNER JOIN party consignor ON consignor.party_id = l.consignor_id
LEFT JOIN party consignee ON consignee.party_id = l.consignee_id
INNER JOIN location loc ON loc.location_id = l.to_id
INNER JOIN goods g ON g.goods_id = l.goods_id
INNER JOIN unit u ON u.unit_id = l.unit_id
WHERE l.is_active
  AND NOT l.is_deleted
  AND NOT b.is_deleted;
