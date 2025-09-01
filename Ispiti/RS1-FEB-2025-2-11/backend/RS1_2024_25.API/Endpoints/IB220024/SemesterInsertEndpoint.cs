using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models.SharedTables;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.IB220024.SemesterInsertEndpoint;
using Microsoft.EntityFrameworkCore;

namespace RS1_2024_25.API.Endpoints.IB220024
{
    [Route("semesters")]
    public class SemesterInsertEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<SemesterInsert>
    .WithActionResult<int>
    {
        [HttpPost]  // Using POST to support both create and update
        public override async Task<ActionResult<int>> HandleAsync([FromBody] SemesterInsert request, CancellationToken cancellationToken = default)
        {

            var student =await  db.Students.FirstOrDefaultAsync(x => x.ID == request.StudentId);
            if (student==null)
            {
                return NotFound("Student not found");
            }

            var city = new Semester();
            db.Semesters.Add(city);
            bool found = await db.Semesters.AnyAsync(x => x.YearOfStudy == request.YearOfStudy && x.StudentId == request.StudentId);
            city.WinterSemester = request.WinterSemester;
            city.YearOfStudy = request.YearOfStudy;
            city.AcademicYearId = request.AcademicYearId;
            city.Tuition = found ? 400 : 1800 ;
            city.Renewal = found;
            city.StudentId = request.StudentId;
            city.UserId=request.UserId;
            await db.SaveChangesAsync(cancellationToken);
            return Ok(city.ID);
        }

        public class SemesterInsert
        {
            public DateTime? WinterSemester { get; set; }
            public int? YearOfStudy { get; set; }
            public int? AcademicYearId { get; set; }
            public float? Tuition { get; set; }
            public bool? Renewal { get; set; }
            public int? UserId { get; set; }
            public int? StudentId { get; set; }
        }
    }
}
