using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAppMenuSidebarColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // app_menu already exists (auth seed / Dapper). Only add sidebar columns.
            migrationBuilder.AddColumn<string>(
                name: "badge",
                schema: "public",
                table: "app_menu",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tooltip",
                schema: "public",
                table: "app_menu",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "default_expanded",
                schema: "public",
                table: "app_menu",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "default_expanded",
                schema: "public",
                table: "app_menu");

            migrationBuilder.DropColumn(
                name: "tooltip",
                schema: "public",
                table: "app_menu");

            migrationBuilder.DropColumn(
                name: "badge",
                schema: "public",
                table: "app_menu");
        }
    }
}
