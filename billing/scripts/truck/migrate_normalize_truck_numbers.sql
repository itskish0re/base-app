-- truck — remove whitespace from truck_number (one-time fix for spaced seed values)

UPDATE truck
SET
    truck_number = regexp_replace(truck_number, '\s', '', 'g'),
    updated_at = NOW()
WHERE truck_number ~ '\s';
