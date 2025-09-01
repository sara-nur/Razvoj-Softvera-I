using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.IB220024.AcademicYearGetAll;

namespace RS1_2024_25.API.Endpoints.IB220024
{
    [Route("academic-years")]
    public class AcademicYearGetAll(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithoutRequest
    .WithResult<AcademicYearGetALl[]>
    {
        [HttpGet]
        public override async Task<AcademicYearGetALl[]> HandleAsync(CancellationToken cancellationToken = default)
        {
            var result = await db.AcademicYears
                            .Select(c => new AcademicYearGetALl
                            {
                                ID = c.ID,
                                Description = c.Description,
                            })
                            .ToArrayAsync(cancellationToken);
            return result;
        }

        public class AcademicYearGetALl
        {
            public required int ID { get; set; }
            public required string Description { get; set; }
        }
    }
}
