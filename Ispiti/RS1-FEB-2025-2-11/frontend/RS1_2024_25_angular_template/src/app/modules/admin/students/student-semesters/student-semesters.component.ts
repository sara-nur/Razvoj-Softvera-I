import { Component, OnInit } from '@angular/core';
import { SemesterGetResponse, SemesterGetService } from '../../../../endpoints/semester-endpoints/semester-get-endpoint.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentGetByIdEndpointService, StudentGetByIdResponse } from '../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';

@Component({
  selector: 'app-student-semesters',
  standalone: false,
  
  templateUrl: './student-semesters.component.html',
  styleUrl: './student-semesters.component.css'
})
export class StudentSemestersComponent implements  OnInit {

  studentId=0;
  student:any;
  displayedColumns: string[] = ['id', 'academicYear', 'yearOfStudy', 'renewal', 'winterSemester','recordedBy'];
  dataSource: MatTableDataSource<SemesterGetResponse> = new MatTableDataSource<SemesterGetResponse>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentGetByIdService: StudentGetByIdEndpointService,
    private semesterGetService:SemesterGetService,
  ) {
  }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.loadStudentData();
      this.getSemesters();
    }
  }

  loadStudentData(): void {
    this.studentGetByIdService.handleAsync(this.studentId).subscribe({
      next: (student: StudentGetByIdResponse) => {
        this.student=student;
      },
      error: (error) => {
        console.error('Error loading student data', error);
      },
    });
  }

  getSemesters(): void {
    this.semesterGetService.handleAsync(this.studentId).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<SemesterGetResponse>(data);
      },
      error: (err) => console.error('Error fetching cities1:', err)
    });
  }

  newSemester() {
    this.router.navigate(['/admin/semesters/new', this.studentId]);
  }
}