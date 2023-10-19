import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Course, sortCoursesBySeqNo} from "../model/course";
import {catchError, map, shareReplay, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "../loading/loading.service";
import {MessageService} from "../messages/message.service";

@Injectable({
  providedIn: 'root'
})

export class CoursesStore {

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messages: MessageService
  ) {
    this.loadAllCourses();      // This will happen only once during the application lifecycle
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses => courses.filter(course => course.category === category)
          .sort(sortCoursesBySeqNo))
      )
  }
  // Here we're going to do 2 things: Update the data in memory to show it immediately and store the data in the database
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();     // This will return the last value emitted by the subject
    const index = courses.findIndex(course => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes
    };
    const newCourses: Course[] = courses.slice(0);  // Creating a copy of the complete array, not the same as assign just courses variable
    newCourses[index] = newCourse

    this.subject.next(newCourses)  // Emitting this will allow to reflect the changes in the view, however we still need to save the data in the database

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError(err => {
          const message = 'Could not load the courses';
          this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        shareReplay()
      );
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map((response:any) => {
          console.log('response>>>>>>', response)
          return response['payload']
        }),
        catchError(err => {
          const message = 'Could not load the courses';
          this.messages.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap(courses => {
          this.subject.next(courses)
        })
      )
    this.loading.showLoaderUntilComplete(loadCourses$)   // Adding loading capabilities to our observable. Removed in favor of course.store.ts
      .subscribe()
  }
}
