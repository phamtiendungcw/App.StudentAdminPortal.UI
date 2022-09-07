import { StudentsComponent } from './students/students.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewStudentComponent } from './students/view-student/view-student.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
  },
  {
    path: 'Students/GetAll',
    component: StudentsComponent,
  },
  {
    path: 'Students/:id',
    component: ViewStudentComponent,
  },
  {
    path: 'Students/GetDetail/:id',
    component: ViewStudentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
