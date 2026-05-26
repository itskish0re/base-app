using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAppFieldDataTypeAndComponentColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "app_field_data_type",
                schema: "public",
                columns: table => new
                {
                    field_data_type_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type_code = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    display_name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_field_data_type", x => x.field_data_type_id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_app_field_data_type_type_code",
                schema: "public",
                table: "app_field_data_type",
                column: "type_code",
                unique: true);

            migrationBuilder.Sql(
                """
                INSERT INTO app_field_data_type (type_code, display_name, description, sort_order, is_active, created_at, updated_at)
                VALUES
                    ('text', 'Text', 'Variable-length string', 10, true, NOW(), NOW()),
                    ('boolean', 'Boolean', 'True/false flag', 20, true, NOW(), NOW()),
                    ('integer', 'Integer', '32-bit signed integer', 30, true, NOW(), NOW()),
                    ('bigint', 'Big integer', '64-bit signed integer', 40, true, NOW(), NOW()),
                    ('numeric', 'Numeric', 'Arbitrary-precision decimal', 50, true, NOW(), NOW()),
                    ('timestamptz', 'Timestamp (TZ)', 'Timestamp with time zone', 60, true, NOW(), NOW()),
                    ('uuid', 'UUID', 'Universally unique identifier', 70, true, NOW(), NOW()),
                    ('date', 'Date', 'Calendar date without time', 80, true, NOW(), NOW())
                ON CONFLICT (type_code) DO NOTHING;
                """);

            migrationBuilder.AddColumn<int>(
                name: "field_data_type_id",
                schema: "public",
                table: "app_entity_field",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE app_entity_field f
                SET field_data_type_id = t.field_data_type_id
                FROM app_field_data_type t
                WHERE t.type_code = f.data_type;
                """);

            migrationBuilder.Sql(
                """
                UPDATE app_entity_field
                SET field_data_type_id = (SELECT field_data_type_id FROM app_field_data_type WHERE type_code = 'text')
                WHERE field_data_type_id IS NULL;
                """);

            migrationBuilder.AlterColumn<int>(
                name: "field_data_type_id",
                schema: "public",
                table: "app_entity_field",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "data_type",
                schema: "public",
                table: "app_entity_field");

            migrationBuilder.RenameColumn(
                name: "format_hint",
                schema: "public",
                table: "app_entity_screen_column",
                newName: "column_component");

            migrationBuilder.RenameColumn(
                name: "format_hint",
                schema: "public",
                table: "app_entity_screen_field",
                newName: "field_component");

            migrationBuilder.AlterColumn<string>(
                name: "column_component",
                schema: "public",
                table: "app_entity_screen_column",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "field_component",
                schema: "public",
                table: "app_entity_screen_field",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_field_field_data_type_id",
                schema: "public",
                table: "app_entity_field",
                column: "field_data_type_id");

            migrationBuilder.AddForeignKey(
                name: "fk_app_entity_field_app_field_data_type_field_data_type_id",
                schema: "public",
                table: "app_entity_field",
                column: "field_data_type_id",
                principalSchema: "public",
                principalTable: "app_field_data_type",
                principalColumn: "field_data_type_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_app_entity_field_app_field_data_type_field_data_type_id",
                schema: "public",
                table: "app_entity_field");

            migrationBuilder.DropIndex(
                name: "ix_app_entity_field_field_data_type_id",
                schema: "public",
                table: "app_entity_field");

            migrationBuilder.AddColumn<string>(
                name: "data_type",
                schema: "public",
                table: "app_entity_field",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE app_entity_field f
                SET data_type = t.type_code
                FROM app_field_data_type t
                WHERE t.field_data_type_id = f.field_data_type_id;
                """);

            migrationBuilder.AlterColumn<string>(
                name: "data_type",
                schema: "public",
                table: "app_entity_field",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32,
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "field_data_type_id",
                schema: "public",
                table: "app_entity_field");

            migrationBuilder.AlterColumn<string>(
                name: "column_component",
                schema: "public",
                table: "app_entity_screen_column",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64,
                oldNullable: true);

            migrationBuilder.RenameColumn(
                name: "column_component",
                schema: "public",
                table: "app_entity_screen_column",
                newName: "format_hint");

            migrationBuilder.AlterColumn<string>(
                name: "field_component",
                schema: "public",
                table: "app_entity_screen_field",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64,
                oldNullable: true);

            migrationBuilder.RenameColumn(
                name: "field_component",
                schema: "public",
                table: "app_entity_screen_field",
                newName: "format_hint");

            migrationBuilder.DropTable(
                name: "app_field_data_type",
                schema: "public");
        }
    }
}
