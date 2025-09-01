using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Helper.Api;
using static RS1_2024_25.API.Endpoints.IB220024.SemesterRenewal;

namespace RS1_2024_25.API.Endpoints.IB220024
{
    [Route("renewal")]
    public class SemesterRenewal(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<RenewalRequest>
    .WithActionResult<RenewalResponse>
    {
        [HttpGet]
        public override async Task<ActionResult<RenewalResponse>> HandleAsync([FromQuery] RenewalRequest request, CancellationToken cancellationToken = default)
        {
            return new RenewalResponse() 
            { Renewal = await db.Semesters.AnyAsync(x => x.YearOfStudy == request.YearOfStudy && x.StudentId == request.StudentId,cancellationToken) };
        }

        public class RenewalResponse
        {
            public bool Renewal { get; set; }
        }
        public class RenewalRequest
        {
            public int StudentId { get; set; }
            public int YearOfStudy { get; set; }
        }
    }
}
