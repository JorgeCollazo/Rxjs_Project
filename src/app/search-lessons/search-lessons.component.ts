import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';

import {Lesson} from '../model/lesson';
import {CourseService} from "../services/course.service";


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css']
})
export class SearchLessonsComponent implements OnInit {

  searchResults$: Observable<Lesson[]> = new Observable<Lesson[]>();

  activeLesson: Lesson | null = null;

  constructor(private coursesService: CourseService) {
  }

  ngOnInit() {
  }

  onSearch(searchValue: string) { console.log(searchValue)
    this.searchResults$ = this.coursesService.searchLessons(searchValue)
  }

  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  onBackToSearch() {
    this.activeLesson = null;
  }

}











