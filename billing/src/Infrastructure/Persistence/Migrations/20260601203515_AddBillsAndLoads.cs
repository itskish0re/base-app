using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddBillsAndLoads : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bills",
                schema: "public",
                columns: table => new
                {
                    bill_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    bill_number = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    bill_date = table.Column<DateOnly>(type: "date", nullable: false),
                    from_id = table.Column<int>(type: "integer", nullable: false),
                    truck_id = table.Column<int>(type: "integer", nullable: false),
                    driver_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    driver_mobile = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    total_freight = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    commission = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    crossing = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    hand_loan = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    truck_loan = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    office_mamul = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    tapal_mamul = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    diesel = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    others = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    total = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    is_cancelled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    financial_year_id = table.Column<int>(type: "integer", nullable: false),
                    is_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<int>(type: "integer", nullable: true),
                    updated_by = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bills", x => x.bill_id);
                });

            migrationBuilder.CreateTable(
                name: "loads",
                schema: "public",
                columns: table => new
                {
                    load_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    bill_id = table.Column<int>(type: "integer", nullable: false),
                    load_number = table.Column<int>(type: "integer", nullable: false),
                    party_id = table.Column<int>(type: "integer", nullable: false),
                    to_id = table.Column<int>(type: "integer", nullable: false),
                    goods_id = table.Column<int>(type: "integer", nullable: false),
                    unit_id = table.Column<int>(type: "integer", nullable: false),
                    weight_or_quantity = table.Column<decimal>(type: "numeric(18,3)", precision: 18, scale: 3, nullable: false),
                    rate_per_unit = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    freight = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    advance = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    topay = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    balance = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    financial_year_id = table.Column<int>(type: "integer", nullable: false),
                    is_enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    deleted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<int>(type: "integer", nullable: true),
                    updated_by = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_loads", x => x.load_id);
                    table.ForeignKey(
                        name: "fk_loads_bills_bill_id",
                        column: x => x.bill_id,
                        principalSchema: "public",
                        principalTable: "bills",
                        principalColumn: "bill_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_bills_financial_year_id",
                schema: "public",
                table: "bills",
                column: "financial_year_id");

            migrationBuilder.CreateIndex(
                name: "ix_bills_from_id",
                schema: "public",
                table: "bills",
                column: "from_id");

            migrationBuilder.CreateIndex(
                name: "ix_bills_truck_id",
                schema: "public",
                table: "bills",
                column: "truck_id");

            migrationBuilder.CreateIndex(
                name: "ux_bills_financial_year_id_bill_number",
                schema: "public",
                table: "bills",
                columns: new[] { "financial_year_id", "bill_number" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_loads_bill_id",
                schema: "public",
                table: "loads",
                column: "bill_id");

            migrationBuilder.CreateIndex(
                name: "ix_loads_financial_year_id",
                schema: "public",
                table: "loads",
                column: "financial_year_id");

            migrationBuilder.CreateIndex(
                name: "ux_loads_bill_id_load_number_active",
                schema: "public",
                table: "loads",
                columns: new[] { "bill_id", "load_number" },
                unique: true,
                filter: "is_active = true");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "loads",
                schema: "public");

            migrationBuilder.DropTable(
                name: "bills",
                schema: "public");
        }
    }
}
