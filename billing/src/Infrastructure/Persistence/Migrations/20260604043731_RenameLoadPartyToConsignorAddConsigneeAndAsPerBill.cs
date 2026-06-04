using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameLoadPartyToConsignorAddConsigneeAndAsPerBill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "party_id",
                schema: "public",
                table: "loads",
                newName: "consignor_id");

            migrationBuilder.AddColumn<bool>(
                name: "as_per_bill",
                schema: "public",
                table: "loads",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "consignee_id",
                schema: "public",
                table: "loads",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE loads
                SET consignee_id = consignor_id
                WHERE consignee_id IS NULL;
                """);

            migrationBuilder.AlterColumn<int>(
                name: "consignee_id",
                schema: "public",
                table: "loads",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "as_per_bill",
                schema: "public",
                table: "loads");

            migrationBuilder.DropColumn(
                name: "consignee_id",
                schema: "public",
                table: "loads");

            migrationBuilder.RenameColumn(
                name: "consignor_id",
                schema: "public",
                table: "loads",
                newName: "party_id");
        }
    }
}
