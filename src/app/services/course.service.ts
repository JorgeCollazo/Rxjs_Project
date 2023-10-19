import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Course} from "../model/course";
import {Observable} from "rxjs";
import {response} from "express";
import {map, shareReplay} from "rxjs/operators";
import {environment} from '../../environments/environment'
import {Lesson} from "../model/lesson";

@Injectable({
  providedIn: 'root'      // This means that there will be just one instance of this method throughout our application
})
export class CourseService {

  constructor(private http: HttpClient) { }

// Our service by design wont return promises, it always will returns Observables to the view layer
// Our service is stateless, meaning that our service won't ever hold any application data, the application will be
// consumed in the component. That is, our service will just consume the API endpoints, transform the data if necessary
// and then return it as Observable. The goal is to make the service methods as reusable as possible.

  loadCourseById(courseId: number){
   return this.http.get<Course>(`/api/courses/${courseId}`)
      .pipe(
        shareReplay()
      );
  }

  loadAllCoursesLessons(courseId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons', {
      params: {
        pageSize: '10000',
        courseId: courseId
      }
    })
      .pipe(
        map((response: any) => response.payload as Lesson[]),
        shareReplay()
      );
  }

  loadAllCourses():Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses")
      .pipe(                                                // We do this because we need to return a Course[] observable, so we need to transform the payload to that
        map((response:any) => response["payload"]),  // since the elements we want are inside payload key
        shareReplay()   // This operator is extremely important because it shares the emitted values of the observable across multiple subscribers. It ensures that the HTTP request is made only once and subsequent subscribers receive the cached result instead of triggering another HTTP request. That's why without it, we're seeing twice there, because for each subscription we are going yo get a separately http request. So , the more subscriptions we do to the returned observable the more http requests are we going the sent
      )
  }
  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> { // The Partial type here allows to represent the complete Course instance without having to pass the complete object, this way we'll still have type safety in our function
    console.log('courseID>>>>>>>>>', courseId);
    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        shareReplay()     // Applying here again the sharedReplay operator
      );
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>('/api/lessons', {
      params: {
        filter: search,
        pageSize: '100'
      }
    })
      .pipe(
        map((response: any) => response.payload as Lesson[]),
        shareReplay()
      );
  }
}
