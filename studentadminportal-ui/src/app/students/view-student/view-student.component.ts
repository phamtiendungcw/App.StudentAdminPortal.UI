import { GenderService } from './../../services/gender.service';
import { Student } from './../../models/ui-models/student.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../student.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  private readonly newProperty = '';
  genderList: Gender[] = [];

  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: '0',
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
      if (this.studentId) {
        this.studentService.getStudent(this.studentId).subscribe((successResponse) => {
          this.student = successResponse;
        });
        this.genderService.getGendersList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  onUpdate(): void {
    // Call Student Service to Update Student
    this.studentService.updateStudent(this.student.id, this.student)
      .subscribe(
        (successResponse) => {
          // Show a notification
          this.snackbar.open('Student update successfully', undefined, {
            duration: 2000
          });
        },
        (errorResponse) => {
          // Log it
        }
      );
  }
}
