using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul1_Auth;
using RS1_2024_25.API.Data.Models.TenantSpecificTables.Modul2_Basic;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models.SharedTables
{
    public class Semester
    {
        public int ID { get; set; }
        public DateTime? WinterSemester { get; set; }
        public int? YearOfStudy { get; set; }
        public int? AcademicYearId { get; set; }

        [ForeignKey(nameof(AcademicYearId))]
        public AcademicYear? AcademicYear { get; set; }
        public float? Tuition { get; set; }
        public bool? Renewal { get; set; }

        public int? StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        public Student? Student { get; set; }

        public int? UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public MyAppUser? User { get; set; }
    }
}
