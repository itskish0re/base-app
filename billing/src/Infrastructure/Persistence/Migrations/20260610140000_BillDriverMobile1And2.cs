using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BillDriverMobile1And2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "driver_mobile",
                table: "bills",
                newName: "driver_mobile_1");

            migrationBuilder.AddColumn<string>(
                name: "driver_mobile_2",
                table: "bills",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "driver_mobile_2",
                table: "bills");

            migrationBuilder.RenameColumn(
                name: "driver_mobile_1",
                table: "bills",
                newName: "driver_mobile");
        }
    }
}
