import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {CourseService} from "../services/course.service";
import {LoadingService} from "../loading/loading.service";
import {MessageService} from "../messages/message.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {CoursesStore} from "../services/course.store";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush  // On push change detection great for big angular apps with lots of Observables
})
export class HomeComponent implements OnInit {

  // These 2 mutable variables will become now observables, since THE COMPONENT ONLY PASSES DATA TO THE VIEW USING
  // OBSERVABLES. This is how a typical reactive application looks like

  // beginnerCourses: Course[];
  beginnerCourses$ : Observable<Course[]> = new Observable<Course[]>;

  // advancedCourses: Course[];
  advancedCourses$: Observable<Course[]> = new Observable<Course[]>;


  constructor(
    // private courseService: CourseService,    // Stateless service commented out because now we are going to use the stateful service below
    private coursesStore: CoursesStore,
    // private loadingService: LoadingService,   // Commented put to use the stateful service
    // private messageService: MessageService,   // Commented put to use the stateful service

    ) {
  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    // this.loadingService.loadingOn(); // Approach 1 less efficient
    // This imperative way may lead to the so called Callback Hell
    // Commented put to use the stateful service
    // const courses$ = this.courseService.loadAllCourses()       // $ Suffix to represent observables
    //   .pipe(
    //     map(courses => courses.sort(sortCoursesBySeqNo)),
    //     // Approach 1 less efficient
    //     // finalize(() => this.loadingService.loadingOff())  // This operator is going to be called whenever the observable completes or errors out
    //     catchError(err => {
    //       const message = "Could not load courses";
    //       this.messageService.showErrors(message);
    //       console.log(message, err);      // To leave some error trace in the log
    //       return throwError(err);         // This will be called whenever the method fails, and it'll create and immediately emits the error and ends the observable lifecycle
    //     })
    //   );
    // Commented put to use the stateful service
    // const loadCourses$ = this.loadingService.showLoaderUntilComplete(courses$) // Approach 2 This new observable will have loading capabilities and we'll pass it to the rest of the application

    // this.beginnerCourses$ = courses$       // Approach 1
    // this.beginnerCourses$ = loadCourses$      // Approach 2 // Commented put to use the stateful service
    //   .pipe(
    //     map(courses => courses.filter(course => course.category == "BEGINNER"))
    //   );
    // this.advancedCourses$ = courses$       // Approach 1
    // this.advancedCourses$ = loadCourses$      // Approach 2 // Commented put to use the stateful service
    //   .pipe(
    //     map(courses => courses.filter(course => course.category == "ADVANCED"))
    //   );
    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");
    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");
  }

}




