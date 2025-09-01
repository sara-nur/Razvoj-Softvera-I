import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentGetByIdEndpointService, StudentGetByIdResponse } from '../../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';
import { MyAuthService } from '../../../../../services/auth-services/my-auth.service';
import { AcademicResponse, AcademicGet } from '../../../../../endpoints/semester-endpoints/academic-year-get-endpoint.service';
import { SemesterInsert } from '../../../../../endpoints/semester-endpoints/semester-insert-service';
import { Renewal } from '../../../../../endpoints/semester-endpoints/semester-renewal.service';
import { SemesterGetResponse, SemesterGetService } from '../../../../../endpoints/semester-endpoints/semester-get-endpoint.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-student-semesters-new',
  standalone: false,

  templateUrl: './student-semesters-new.component.html',
  styleUrl: './student-semesters-new.component.css'
})
export class StudentSemestersNewComponent implements OnInit {

  semesterForm: FormGroup;
  studentId: number = 0;
  userId: number | undefined = 0
  tuition: number = 1800
  renewal: boolean = false;
  student: any;
  aYears: AcademicResponse[] = [];
  semesters: SemesterGetResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private semesetrInser: SemesterInsert,
    private ayearGet: AcademicGet,
    private renwalS: Renewal,
    private auth: MyAuthService,
    private studentGetByIdService: StudentGetByIdEndpointService,
    private semesterGetByStudentIdService: SemesterGetService
  ) {

    this.semesterForm = this.fb.group({
      winterSemester: ['', [Validators.required]],
      yearOfStudy: [null, [Validators.required, Validators.min(1), Validators.max(6)]],
      academicYearId: [null, [Validators.required]],
      tuition: { value: 1800, disabled: true },
      renewal: { value: false, disabled: true }
    });
  }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.loadStudentData();
      this.loadSemesters();
    }
    this.loadAcademicYears();
    this.userId = this.auth.getMyAuthInfo()?.userId;
    console.log("Userid" + this.userId);
  }

  loadSemesters() {
    this.semesterGetByStudentIdService.handleAsync(this.studentId).subscribe(
      (data) => {
        this.semesters = data;
      }
    )
  }

  loadStudentData(): void {
    this.studentGetByIdService.handleAsync(this.studentId).subscribe({
      next: (student: StudentGetByIdResponse) => {
        this.student = student;
      },
      error: (error) => {
        console.error('Error loading student data', error);
      },
    });
  }



  InsertSemester(): void {
    if (this.semesterForm.invalid) return;
    this.semesetrInser.handleAsync({
      ...this.semesterForm.value,
      renewal: this.renewal,
      tuition: this.tuition,
      userId: this.userId,
      studentId: this.studentId
    }).subscribe({
      next: () => this.cancle(),
      error: (error) => console.error('Error updating city', error),
    });
  }

  private loadAcademicYears() {
    this.ayearGet.handleAsync().subscribe({
      next: (data) => this.aYears = data,
      error: (error) => console.error(error),
    });
  }

  CheckAcademicYear() {
    const selectedYearId = this.semesterForm.get('academicYearId')?.value;
    var isDuplicate = false;

    this.semesters.forEach(semester => {
      if (semester.academicYearId == selectedYearId)
        isDuplicate = true;
    });

    if (isDuplicate) {
      this.semesterForm.get('academicYearId')?.setErrors({ duplicate: true });
    } else {
      this.semesterForm.get('academicYearId')?.setErrors(null);
    }
  }

  cancle() {
    this.router.navigate(["/admin/students/semester", this.studentId])
  }

  renewalCheck() {
    const n = this.semesterForm.get("yearOfStudy")?.value;
    this.renwalS.handleAsync({ studentId: this.studentId, yearOfStudy: n }).subscribe(
      {
        next: (data) => {
          this.renewal = data.renewal;
          this.tuition = this.renewal ? 400 : 1800;
          this.semesterForm.patchValue({ renewal: this.renewal, tuition: this.tuition });
        },
        error: (err) => console.log(err)
      }
    )
  }



}
