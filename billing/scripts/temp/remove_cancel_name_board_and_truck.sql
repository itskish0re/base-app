-- Temp: remove erroneous "Cancel" placeholder rows from name_board + truck.
--
-- Why this exists:
--   Trucks_details.csv contained a literal "Cancel" row (not a real vehicle).
--   The seed generator imported it as name_board code 'cancel' and truck_number 'Cancel'.
--
-- Run once per environment, then delete this file (or keep for reference):
--   cd billing
--   psql "$CONN" -f scripts/temp/remove_cancel_name_board_and_truck.sql
--
-- If any bills still reference a Cancel truck, they are listed and the script aborts.
-- Reassign or cancel those bills manually, then re-run.

BEGIN;

DO $$
DECLARE
    cancel_board_ids int[];
    cancel_truck_ids int[];
    bill_count int;
    bill_id int;
BEGIN
    SELECT coalesce(array_agg(name_board_id), ARRAY[]::int[])
    INTO cancel_board_ids
    FROM name_board
    WHERE lower(code) = 'cancel'
       OR lower(trim(name)) = 'cancel';

    SELECT coalesce(array_agg(truck_id), ARRAY[]::int[])
    INTO cancel_truck_ids
    FROM truck
    WHERE upper(replace(truck_number, ' ', '')) = 'CANCEL'
       OR (cardinality(cancel_board_ids) > 0 AND name_board_id = ANY (cancel_board_ids));

    SELECT count(*)
    INTO bill_count
    FROM bills
    WHERE truck_id = ANY (cancel_truck_ids)
      AND NOT is_deleted;

    IF bill_count > 0 THEN
        RAISE NOTICE 'Bills still referencing Cancel truck(s) — fix these before deleting trucks:';
        FOR bill_id IN
            SELECT b.bill_id
            FROM bills b
            WHERE b.truck_id = ANY (cancel_truck_ids)
              AND NOT b.is_deleted
            ORDER BY b.bill_id
        LOOP
            RAISE NOTICE '  bill_id=%', bill_id;
        END LOOP;

        RAISE EXCEPTION
            'Aborting: % bill(s) reference Cancel truck(s). Reassign truck_id or cancel those bills first.',
            bill_count;
    END IF;

    DELETE FROM truck
    WHERE truck_id = ANY (cancel_truck_ids);

    RAISE NOTICE 'Deleted % truck row(s) (Cancel placeholder).', cardinality(cancel_truck_ids);

    DELETE FROM name_board
    WHERE name_board_id = ANY (cancel_board_ids);

    RAISE NOTICE 'Deleted % name_board row(s) (code cancel).', cardinality(cancel_board_ids);
END $$;

COMMIT;
