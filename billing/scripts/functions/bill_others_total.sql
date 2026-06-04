-- Sum bills.others for v_bills (legacy numeric column or jsonb [{key, value}, ...] array).
-- Run in the same database/schema as bills (typically public).

DROP FUNCTION IF EXISTS public.bill_others_total(numeric);
DROP FUNCTION IF EXISTS public.bill_others_total(jsonb);
DROP FUNCTION IF EXISTS public.bill_others_total(anyelement);

CREATE OR REPLACE FUNCTION public.bill_others_total(others anyelement)
RETURNS numeric(18, 2)
LANGUAGE plpgsql
STABLE
AS $function$
DECLARE
    type_name text := pg_typeof(others)::text;
BEGIN
    IF others IS NULL THEN
        RETURN 0;
    END IF;

    IF type_name = 'jsonb' THEN
        RETURN COALESCE(
            (
                SELECT SUM((elem->>'value')::numeric)
                FROM jsonb_array_elements(
                    CASE
                        WHEN jsonb_typeof(others) = 'array' THEN others
                        ELSE '[]'::jsonb
                    END
                ) AS elem
            ),
            0
        )::numeric(18, 2);
    END IF;

    RETURN others::numeric(18, 2);
END;
$function$;
