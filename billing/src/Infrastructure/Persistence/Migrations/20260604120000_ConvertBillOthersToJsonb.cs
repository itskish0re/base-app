using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConvertBillOthersToJsonb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN others DROP DEFAULT;
                """);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN others TYPE jsonb
                    USING (
                        CASE
                            WHEN others IS NULL OR others = 0 THEN '[]'::jsonb
                            ELSE jsonb_build_array(jsonb_build_object('key', 'Other', 'value', others))
                        END
                    );
                """);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN others SET DEFAULT '[]'::jsonb;
                """);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN others SET NOT NULL;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN others DROP DEFAULT;
                """);

            migrationBuilder.Sql(
                """
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
                """);

            migrationBuilder.Sql(
                """
                ALTER TABLE bills
                    ALTER COLUMN others SET DEFAULT 0;
                """);
        }
    }
}
