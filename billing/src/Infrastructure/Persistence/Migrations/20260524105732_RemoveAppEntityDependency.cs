using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAppEntityDependency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "app_entity_dependency",
                schema: "public");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "app_entity_dependency",
                schema: "public",
                columns: table => new
                {
                    entity_dependency_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    child_entity_id = table.Column<int>(type: "integer", nullable: false),
                    parent_entity_id = table.Column<int>(type: "integer", nullable: false),
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
        }
    }
}
