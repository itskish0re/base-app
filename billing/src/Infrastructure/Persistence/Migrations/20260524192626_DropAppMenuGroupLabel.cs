using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DropAppMenuGroupLabel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE app_menu SET menu_group = 'config' WHERE menu_group = 'projects';

                ALTER TABLE app_menu DROP COLUMN IF EXISTS group_label;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "group_label",
                schema: "public",
                table: "app_menu",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);
        }
    }
}
