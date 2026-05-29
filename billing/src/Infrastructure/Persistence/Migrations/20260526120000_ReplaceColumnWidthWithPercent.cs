using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceColumnWidthWithPercent : Migration
    {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>(
            name: "column_width_percent",
            schema: "public",
            table: "app_entity_screen_column",
            type: "integer",
            nullable: true);

        migrationBuilder.Sql(
            """
            UPDATE app_entity_screen_column
            SET column_width_percent = COALESCE(column_width_percent, 20)
            WHERE column_width_percent IS NULL;
            """);

        migrationBuilder.DropColumn(
            name: "column_width",
            schema: "public",
            table: "app_entity_screen_column");

        migrationBuilder.DropColumn(
            name: "min_width",
            schema: "public",
            table: "app_entity_screen_column");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>(
            name: "column_width",
            schema: "public",
            table: "app_entity_screen_column",
            type: "integer",
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "min_width",
            schema: "public",
            table: "app_entity_screen_column",
            type: "integer",
            nullable: true);

        migrationBuilder.DropColumn(
            name: "column_width_percent",
            schema: "public",
            table: "app_entity_screen_column");
    }
    }
}
