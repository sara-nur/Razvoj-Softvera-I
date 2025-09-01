using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class _2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                table: "Students",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_DeletedByUserId",
                table: "Students",
                column: "DeletedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_MyAppUsers_DeletedByUserId",
                table: "Students",
                column: "DeletedByUserId",
                principalTable: "MyAppUsers",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_MyAppUsers_DeletedByUserId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_DeletedByUserId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                table: "Students");
        }
    }
}
