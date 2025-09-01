using FluentValidation;
using RS1_2024_25.API.Data;
using RS1_2024_25.API.Endpoints.StudentEndpoints;

namespace RS1_2024_25.API.Endpoints.IB220024
{
    public class SemesterInsertEndpointValidator : AbstractValidator<SemesterInsertEndpoint.SemesterInsert>
    {
        public SemesterInsertEndpointValidator(ApplicationDbContext dbContext)
        {
            RuleFor(x => x)
                .Must(request =>
                {
                    if (request.AcademicYearId.HasValue)
                    {
                        return !dbContext.Semesters.Any(s=>s.StudentId==request.StudentId && s.AcademicYearId==request.AcademicYearId);
                    }
                    return true;
                })
                .WithMessage("Akademska godina vec postoji.");

        }
    }
}
