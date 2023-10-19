import {Component, Input, OnInit} from '@angular/core';
import {Lesson} from "../model/lesson";

@Component({
  selector: 'lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})

export class LessonComponent  {

@Input()
lesson: Lesson =  {
  id: 0,
  description: '',
  duration: '',
  seqNo: 0,
  courseId: 0,
  videoId:''
}

}
