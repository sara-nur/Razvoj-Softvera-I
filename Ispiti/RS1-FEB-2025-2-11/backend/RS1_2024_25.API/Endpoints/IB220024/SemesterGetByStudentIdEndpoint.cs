using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models.SharedTables;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul1_Auth;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul2_Basic;
using RS1_2024_25.API.Helper.Api;
using System.ComponentModel.DataAnnotations.Schema;
using static RS1_2024_25.API.Endpoints.IB220024.SemesterGetByStudentIdEndpoint;

namespace RS1_2024_25.API.Endpoints.IB220024
{
    [Route("semesters")]
    public class SemesterGetByStudentIdEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<int>
    .WithActionResult<SemesterGetByStudentIdResponse[]>
    {
        [HttpGet("{id}")]
        public override async Task<ActionResult<SemesterGetByStudentIdResponse[]>> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            var student = await db.Students.Where(s => s.ID == id).FirstOrDefaultAsync();
            if (student == null)
                return NotFound();

            var city = await db.Semesters
                                .Where(c => c.StudentId == id)
                                .Select(c => new SemesterGetByStudentIdResponse
                                {
                                    ID = c.ID,
                                    WinterSemester = c.WinterSemester,
                                    YearOfStudy = c.YearOfStudy,
                                    AcademicYearId = c.AcademicYearId,
                                    Description = c.AcademicYear==null? "" :c.AcademicYear.Description,
                                    Tuition = c.Tuition,
                                    Renewal = c.Renewal,
                                    StudentId = c.StudentId,
                                    RecordedBy = c.User == null ? "" : c.User.FirstName,
                                })
                                .ToArrayAsync( cancellationToken);

            if (city == null)
            {
                throw new ArgumentException("City not found");
            }


            return Ok(city);
        }

        public class SemesterGetByStudentIdResponse
        {
            public required int ID { get; set; }
            public DateTime? WinterSemester { get; set; }
            public int? YearOfStudy { get; set; }
            public int? AcademicYearId { get; set; }
            public string? Description { get; set; }
            public float? Tuition { get; set; }
            public bool? Renewal { get; set; }
            public int? StudentId { get; set; }
            public string? RecordedBy { get; set; }
        }
    }
}
