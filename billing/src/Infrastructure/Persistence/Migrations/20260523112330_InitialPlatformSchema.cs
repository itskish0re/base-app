using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialPlatformSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "app_entity",
                schema: "public",
                columns: table => new
                {
                    entity_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    entity_name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    entity_kind = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    persist_mode = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    table_name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    display_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<int>(type: "integer", nullable: true),
                    updated_by = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_entity", x => x.entity_id);
                });

            migrationBuilder.CreateTable(
                name: "app_entity_dependency",
                schema: "public",
                columns: table => new
                {
                    entity_dependency_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    parent_entity_id = table.Column<int>(type: "integer", nullable: false),
                    child_entity_id = table.Column<int>(type: "integer", nullable: false),
                    child_fk_column = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_entity_dependency", x => x.entity_dependency_id);
                    table.ForeignKey(
                        name: "fk_app_entity_dependency_app_entity_child_entity_id",
                        column: x => x.child_entity_id,
                        principalSchema: "public",
                        principalTable: "app_entity",
                        principalColumn: "entity_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_app_entity_dependency_app_entity_parent_entity_id",
                        column: x => x.parent_entity_id,
                        principalSchema: "public",
                        principalTable: "app_entity",
                        principalColumn: "entity_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "app_entity_field",
                schema: "public",
                columns: table => new
                {
                    entity_field_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    entity_id = table.Column<int>(type: "integer", nullable: false),
                    field_name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    data_type = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    filterable = table.Column<bool>(type: "boolean", nullable: false),
                    sortable = table.Column<bool>(type: "boolean", nullable: false),
                    selectable = table.Column<bool>(type: "boolean", nullable: false),
                    writable = table.Column<bool>(type: "boolean", nullable: false),
                    is_required = table.Column<bool>(type: "boolean", nullable: false),
                    min_length = table.Column<int>(type: "integer", nullable: true),
                    max_length = table.Column<int>(type: "integer", nullable: true),
                    validation_regex = table.Column<string>(type: "text", nullable: true),
                    default_value = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_entity_field", x => x.entity_field_id);
                    table.ForeignKey(
                        name: "fk_app_entity_field_app_entity_entity_id",
                        column: x => x.entity_id,
                        principalSchema: "public",
                        principalTable: "app_entity",
                        principalColumn: "entity_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "app_entity_screen",
                schema: "public",
                columns: table => new
                {
                    entity_screen_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    entity_id = table.Column<int>(type: "integer", nullable: false),
                    menu_id = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    created_by = table.Column<int>(type: "integer", nullable: true),
                    updated_by = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_entity_screen", x => x.entity_screen_id);
                    table.ForeignKey(
                        name: "fk_app_entity_screen_app_entity_entity_id",
                        column: x => x.entity_id,
                        principalSchema: "public",
                        principalTable: "app_entity",
                        principalColumn: "entity_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "app_entity_screen_column",
                schema: "public",
                columns: table => new
                {
                    entity_screen_column_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    entity_screen_id = table.Column<int>(type: "integer", nullable: false),
                    entity_field_id = table.Column<int>(type: "integer", nullable: false),
                    display_label = table.Column<string>(type: "text", nullable: true),
                    is_visible = table.Column<bool>(type: "boolean", nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    column_width = table.Column<int>(type: "integer", nullable: true),
                    min_width = table.Column<int>(type: "integer", nullable: true),
                    is_pinned = table.Column<bool>(type: "boolean", nullable: false),
                    align = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    format_hint = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    allow_sort = table.Column<bool>(type: "boolean", nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_entity_screen_column", x => x.entity_screen_column_id);
                    table.ForeignKey(
                        name: "fk_app_entity_screen_column_app_entity_field_entity_field_id",
                        column: x => x.entity_field_id,
                        principalSchema: "public",
                        principalTable: "app_entity_field",
                        principalColumn: "entity_field_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_app_entity_screen_column_app_entity_screen_entity_screen_id",
                        column: x => x.entity_screen_id,
                        principalSchema: "public",
                        principalTable: "app_entity_screen",
                        principalColumn: "entity_screen_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "app_entity_screen_field",
                schema: "public",
                columns: table => new
                {
                    entity_screen_field_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    entity_screen_id = table.Column<int>(type: "integer", nullable: false),
                    entity_field_id = table.Column<int>(type: "integer", nullable: false),
                    display_label = table.Column<string>(type: "text", nullable: true),
                    is_visible = table.Column<bool>(type: "boolean", nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: false),
                    format_hint = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    is_read_only = table.Column<bool>(type: "boolean", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_app_entity_screen_field", x => x.entity_screen_field_id);
                    table.ForeignKey(
                        name: "fk_app_entity_screen_field_app_entity_field_entity_field_id",
                        column: x => x.entity_field_id,
                        principalSchema: "public",
                        principalTable: "app_entity_field",
                        principalColumn: "entity_field_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_app_entity_screen_field_app_entity_screen_entity_screen_id",
                        column: x => x.entity_screen_id,
                        principalSchema: "public",
                        principalTable: "app_entity_screen",
                        principalColumn: "entity_screen_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_entity_name",
                schema: "public",
                table: "app_entity",
                column: "entity_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_table_name",
                schema: "public",
                table: "app_entity",
                column: "table_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_dependency_child_entity_id",
                schema: "public",
                table: "app_entity_dependency",
                column: "child_entity_id");

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_dependency_parent_entity_id_child_entity_id",
                schema: "public",
                table: "app_entity_dependency",
                columns: new[] { "parent_entity_id", "child_entity_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_field_entity_id_field_name",
                schema: "public",
                table: "app_entity_field",
                columns: new[] { "entity_id", "field_name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_screen_entity_id_menu_id",
                schema: "public",
                table: "app_entity_screen",
                columns: new[] { "entity_id", "menu_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_screen_menu_id",
                schema: "public",
                table: "app_entity_screen",
                column: "menu_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_screen_column_entity_field_id",
                schema: "public",
                table: "app_entity_screen_column",
                column: "entity_field_id");

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_screen_column_entity_screen_id_entity_field_id",
                schema: "public",
                table: "app_entity_screen_column",
                columns: new[] { "entity_screen_id", "entity_field_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_screen_field_entity_field_id",
                schema: "public",
                table: "app_entity_screen_field",
                column: "entity_field_id");

            migrationBuilder.CreateIndex(
                name: "ix_app_entity_screen_field_entity_screen_id_entity_field_id",
                schema: "public",
                table: "app_entity_screen_field",
                columns: new[] { "entity_screen_id", "entity_field_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "app_entity_dependency",
                schema: "public");

            migrationBuilder.DropTable(
                name: "app_entity_screen_column",
                schema: "public");

            migrationBuilder.DropTable(
                name: "app_entity_screen_field",
                schema: "public");

            migrationBuilder.DropTable(
                name: "app_entity_field",
                schema: "public");

            migrationBuilder.DropTable(
                name: "app_entity_screen",
                schema: "public");

            migrationBuilder.DropTable(
                name: "app_entity",
                schema: "public");
        }
    }
}
