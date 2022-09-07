import { GenderService } from './../../services/gender.service';
import { Student } from './../../models/ui-models/student.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
      if (this.studentId) {
        if (this.studentId.toLocaleLowerCase() === 'Add'.toLocaleLowerCase()) {
          // => New Student Func
          this.isNewStudent = true;
          this.header = 'Add New Student';
          this.setImage();
        } else {
          // => Exiting Student Func
          this.isNewStudent = false;
          this.header = 'Edit Student';
          this.studentService.getStudent(this.studentId).subscribe(
            (successResponse) => {
              this.student = successResponse;
              this.setImage();
            },
            (errorResponse) => {
              this.setImage();
            }
          );
        }

        this.genderService.getGendersList().subscribe((successResponse) => {
          this.genderList = successResponse;
        });
      }
    });
  }

  onUpdate() {
    // Call Student Service to Update Student
    this.studentService.updateStudent(this.student.id, this.student).subscribe(
      (successResponse) => {
        // Show a notification
        this.snackbar.open('Student updated successfully', undefined, {
          duration: 2000,
        });
        setTimeout(() => {
          this.router.navigateByUrl('Students/GetAll');
        }, 100);
      },
      (errorResponse) => {
        // Log it
      }
    );
  }

  onDelete() {
    // Student service to delete
    this.studentService.deleteStudent(this.student.id).subscribe(
      (successResponse) => {
        this.snackbar.open('Student deleted successfully', undefined, {
          duration: 2500,
        });
        setTimeout(() => {
          this.router.navigateByUrl('Students/GetAll');
        }, 100);
      },
      (errorResponse) => {
        // Log it
      }
    );
  }

  onAdd() {
    this.studentService.addStudent(this.student).subscribe(
      (successResponse) => {
        this.snackbar.open('Student added successfully', undefined, {
          duration: 2000,
        });
        setTimeout(() => {
          this.router.navigateByUrl(`Students/GetDetail/${successResponse.id}`);
        }, 2000);
      },
      (errorResponse) => {
        // Log
      }
    );
  }

  private setImage() {
    if (this.student.profileImageUrl) {
      // Fetch the image by url
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    } else {
      // Display a default
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }

  uploadImage(event: any) {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
        .subscribe((successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();
          this.snackbar.open('Profile Image Update', undefined, {
            duration: 2000,
          });
        },
          (errorResponse) => {
            // Log
          }
        );
    }
  }
}
