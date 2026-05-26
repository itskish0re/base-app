using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MapAppRoleAndRoleMenu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // app_role and app_role_menu already exist (auth/platform seed). EF maps them only.
            migrationBuilder.Sql(
                """
                ALTER TABLE app_menu
                  ADD COLUMN IF NOT EXISTS menu_group character varying(32) NOT NULL DEFAULT 'main';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "menu_group",
                schema: "public",
                table: "app_menu");
        }
    }
}
