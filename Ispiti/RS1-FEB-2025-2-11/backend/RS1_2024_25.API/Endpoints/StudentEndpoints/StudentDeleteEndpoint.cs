namespace RS1_2024_25.API.Endpoints.StudentEndpoints;

using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Helper.Api;
using RS1_2024_25.API.Services;
using System.Threading;
using System.Threading.Tasks;
using static RS1_2024_25.API.Endpoints.StudentEndpoints.StudentDeleteEndpoint;

[MyAuthorization(isAdmin: true, isManager: false)]
[Route("students")]
public class StudentDeleteEndpoint(ApplicationDbContext db) : MyEndpointBaseAsync
    .WithRequest<StudentDeleteRequest>
    .WithoutResult
{
    [HttpDelete]
    public override async Task HandleAsync([FromQuery]StudentDeleteRequest studentDeleteRequest, CancellationToken cancellationToken = default)
    {
        var student = await db.Students.SingleOrDefaultAsync(x => x.ID == studentDeleteRequest.StudentId, cancellationToken);
        var deletedBy = await db.MyAppUsers.SingleOrDefaultAsync(x => x.ID == studentDeleteRequest.DeletedByUserId, cancellationToken);

        if (student == null)
            throw new KeyNotFoundException("Student not found");

        if (deletedBy == null)
            throw new KeyNotFoundException("Admin not found");

        if (student.IsDeleted)
            throw new Exception("Student is already deleted");

        // Soft-delete
        student.IsDeleted = true;
        student.DeletedTime = DateTime.Now;
        student.DeletedByUserId = studentDeleteRequest.DeletedByUserId;
        await db.SaveChangesAsync(cancellationToken);
    }

    public class StudentDeleteRequest
    {
        public int StudentId { get; set; }

        public int DeletedByUserId { get; set; }
    }
}
