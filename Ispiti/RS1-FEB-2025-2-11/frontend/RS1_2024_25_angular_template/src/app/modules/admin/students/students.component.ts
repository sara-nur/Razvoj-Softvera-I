import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StudentGetAllResponse } from '../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import { StudentGetAllEndpointService } from '../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import { StudentDeleteEndpointService } from '../../../endpoints/student-endpoints/student-delete-endpoint.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, filter, map, Subject, switchMap, tap } from 'rxjs';
import { MyDialogConfirmComponent } from '../../shared/dialogs/my-dialog-confirm/my-dialog-confirm.component';
import {MySnackbarHelperService} from '../../shared/snackbars/my-snackbar-helper.service';
import {MyDialogSimpleComponent} from '../../shared/dialogs/my-dialog-simple/my-dialog-simple.component';
import { MyAuthService } from '../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: false
})
export class StudentsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'studentNumber', 'actions', 'deletedDate', 'deletedBy' ];
  dataSource: MatTableDataSource<StudentGetAllResponse> = new MatTableDataSource<StudentGetAllResponse>();
  students: StudentGetAllResponse[] = [];
  showDeleted: boolean = false;
  deletedByFilter: string = "";
  searchFilter:string="";
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
   private searchSubject: Subject<string> = new Subject();

  constructor(
    private studentGetService: StudentGetAllEndpointService,
    private studentDeleteService: StudentDeleteEndpointService,
    private mMyAuthService : MyAuthService,
    private snackbar: MySnackbarHelperService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchStudents();
    this.initSearchListener();
  }
  
initSearchListener(): void {
    this.searchSubject.pipe(
      map((v)=>v.toLowerCase()),
      filter((v)=>v.length > 3 || v.length==0),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((filterValue) => {
      this.fetchStudents(filterValue, this.paginator.pageIndex + 1, this.paginator.pageSize);
    });
  }


  ngAfterViewInit(): void {
  this.paginator.page.subscribe(() => {
      const filterValue = this.dataSource.filter || '';
      this.searchSubject.next(filterValue);
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchFilter=filterValue;
    this.searchSubject.next(filterValue);
  }
  applyDeletedByFilter(event: Event) {
      this.deletedByFilter=(event.target as HTMLInputElement).value.trim().toLowerCase();
      this.fetchStudents(this.searchFilter,this.paginator.pageIndex + 1, this.paginator.pageSize);
  }


  fetchStudents(filter: string = '', page: number = 1, pageSize: number = 5): void {
    this.studentGetService.handleAsync({
      q: filter,
      showDeleted:this.showDeleted,
      pageNumber: page,
      pageSize: pageSize,
      deletedBy:this.deletedByFilter
    }).pipe(
      tap(data=>{
        console.log("Broj redova: " + data.totalCount);
      })
    ).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<StudentGetAllResponse>(data.dataItems);
        this.paginator.length = data.totalCount;
      },
      error: (err) => {
        this.snackbar.showMessage('Error fetching students. Please try again.', 5000);
        console.error('Error fetching students:', err);
      }
    });
  }

  editStudent(id: number): void {
    this.router.navigate(['/admin/students/edit', id]);
  }

  deleteStudent(id: number): void {
    const adminId= this.mMyAuthService.getMyAuthInfo()?.userId;
    if(adminId==null)
      return;

    this.studentDeleteService.handleAsync({
      studentId:id,
      deletedByUserId:adminId
    }).subscribe({
      next: () => {
        this.snackbar.showMessage('Student successfully deleted.');
        this.fetchStudents(); // Refresh the list after deletion
      },
      error: (err) => {
        this.snackbar.showMessage('Error deleting student. Please try again.', 5000);
        console.error('Error deleting student:', err);
      }
    });
  }
  
  toggleDeleted() {
    this.showDeleted=!this.showDeleted;
    this.fetchStudents();
  }


  openMyConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(MyDialogConfirmComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this student?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed deletion');
        this.deleteStudent(id);
      } else {
        console.log('User cancelled deletion');
      }
    });
  }

  openStudentSemesters(id:number) {
    this.router.navigate(['/admin/students/semester', id]);
  }
}

