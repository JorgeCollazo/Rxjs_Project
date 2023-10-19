import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CourseService} from "../services/course.service";

interface CourseData {   // Placed here because there is no need to export it as it won't be used anywhere else
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush   // On push change detection great for big angular apps with lots of Observables
})

export class CourseComponent implements OnInit {

  // course$!: Observable<Course>;      // Commented out in favor of the Single Data Observable Pattern
  // lessons$: Observable<Lesson[]> = new Observable();

  data$: Observable<{ course: Course; lessons: Lesson[] }> = new Observable();   // Single Data Observable Pattern

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    const courseId = parseInt(<string>this.route.snapshot.paramMap.get("courseId"));
    // this.course$ = this.courseService.loadCourseById(courseId);  // Commented out in favor of Single Data Observable Pattern
    // this.lessons$ = this.courseService.loadAllCoursesLessons(courseId); // Idem Above

    // Commented out in favor of below because this way we have to wait for the 2 observables to be emitted in order to emit the dataCourse Observable
    // const course$ = this.courseService.loadCourseById(courseId);
    // const lessons$ = this.courseService.loadAllCoursesLessons(courseId);

    // In this new way we have the course data available right away and then the lessons data
    const course$ = this.courseService.loadCourseById(courseId)
                        .pipe(
                          startWith(null)
                        )
    const lessons$ = this.courseService.loadAllCoursesLessons(courseId)
                          .pipe(
                            startWith(null)
                          )

    this.data$ = combineLatest([course$, lessons$])  // Whenever one of this observables emits some value, we're going to be emitting a new value of type CourseData
      .pipe(
        map(([course, lessons]) => {
          return {
            course,
            lessons
          }
        }),
        tap(console.log)
      )
  }


}











