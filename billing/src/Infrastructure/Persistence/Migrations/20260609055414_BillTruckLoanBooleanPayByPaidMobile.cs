using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BillTruckLoanBooleanPayByPaidMobile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'bills'
                          AND column_name = 'others'
                          AND udt_name = 'numeric') THEN
                        ALTER TABLE bills ALTER COLUMN others DROP DEFAULT;
                        ALTER TABLE bills
                            ALTER COLUMN others TYPE jsonb
                            USING (
                                CASE
                                    WHEN others IS NULL OR others = 0 THEN '[]'::jsonb
                                    ELSE jsonb_build_array(jsonb_build_object('key', 'Other', 'value', others))
                                END
                            );
                        ALTER TABLE bills ALTER COLUMN others SET DEFAULT '[]'::jsonb;
                        ALTER TABLE bills ALTER COLUMN others SET NOT NULL;
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql(
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'loads'
                          AND column_name = 'consignee_id'
                          AND is_nullable = 'YES') THEN
                        ALTER TABLE loads
                            ALTER COLUMN consignee_id DROP NOT NULL;
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql(
                """
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'bills'
                          AND column_name = 'truck_loan'
                          AND udt_name = 'numeric') THEN
                        ALTER TABLE bills
                            ALTER COLUMN truck_loan TYPE boolean
                            USING (truck_loan <> 0);
                    END IF;
                END $$;
                """);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN truck_loan SET DEFAULT false;
                """);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ADD COLUMN IF NOT EXISTS pay_by character varying(16);

                ALTER TABLE bills
                    ADD COLUMN IF NOT EXISTS paid_mobile character varying(32);
                """);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    DROP CONSTRAINT IF EXISTS ck_bills_pay_by;

                ALTER TABLE bills
                    ADD CONSTRAINT ck_bills_pay_by
                    CHECK (pay_by IS NULL OR pay_by IN ('upi', 'cash', 'owner'));
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    DROP CONSTRAINT IF EXISTS ck_bills_pay_by;
                """);

            migrationBuilder.DropColumn(
                name: "pay_by",
                table: "bills");

            migrationBuilder.DropColumn(
                name: "paid_mobile",
                table: "bills");

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN truck_loan TYPE numeric(18, 2)
                    USING (CASE WHEN truck_loan THEN 1 ELSE 0 END);
                """);

            migrationBuilder.Sql(
                """
                UPDATE loads
                SET consignee_id = consignor_id
                WHERE consignee_id IS NULL;
                """);

            migrationBuilder.AlterColumn<int>(
                name: "consignee_id",
                table: "loads",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN others DROP DEFAULT;

                ALTER TABLE bills
                    ALTER COLUMN others TYPE numeric(18, 2)
                    USING (
                        COALESCE(
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
                        )
                    );

                ALTER TABLE bills
                    ALTER COLUMN others SET DEFAULT 0;
                """);
        }
    }
}
