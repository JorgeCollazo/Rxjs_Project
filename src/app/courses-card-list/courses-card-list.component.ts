import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Course} from "../model/course";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CourseDialogComponent} from "../course-dialog/course-dialog.component";
import {filter, tap} from "rxjs/operators";

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush     // On push change detection great for big angular apps with lots of Observables
})
export class CoursesCardListComponent {
  // This mechanism of sharing data across components (@input and @output) is only useful when one component is present within the template of the other component (Parent - Child relationship)
  // If you need to share data across components at completely different levels
  @Input()
  courses: Course[] = [];

  @Output()
  private coursesChanged = new EventEmitter();

  constructor(private dialog: MatDialog){}

  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);  // CourseDialogComponent is not a direct child of the CoursesCardListComponent
      dialogRef.afterClosed() // This dialog method emits an observable that will emit values whenever the dialog gets closed
        .pipe(
          filter(value => !!value),   // The !! is converting the value into a boolean whenever the value is truthy
          tap(() => this.coursesChanged.emit()) // It allows you (tap method) to perform side effects such as logging, updating variables, or triggering events without modifying the emitted values.
        )
        .subscribe(            // Subscribing here will ensures that you will get notified whenever the dialog is closed

        )
  }
}
