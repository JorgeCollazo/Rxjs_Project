import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {CourseService} from "../services/course.service";
import {LoadingService} from "../loading/loading.service";
import {MessageService} from "../messages/message.service";
import {CoursesStore} from "../services/course.store";

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
      LoadingService,    // Placing this here, we are creating locally at the level of the component a new instance of LoadingService and it'll be accessible to any direct child of this component, so the instance injected in the constructor is the one at component level, not at root level
      MessageService    // Placing this here, we are creating locally at the level of the component a new instance of MessageService and it'll be accessible to any direct child of this component, so the instance injected in the constructor is the one at component level, not at root level
    ]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private courseStore: CoursesStore,
        // private courseService: CourseService,      // No need to use it in favor of the course.store.ts
        // private loadingService: LoadingService,      // This service is not accessible from this component. Since this service is declared at the level of the app-root component, it'll be only available to its child components and their descendent (grandchild). These are all the components that are rendered into the app.component.html template, including those in the <router-outlet> tags. For example the homeComponent has access to it. (Same above). Removed in favor of the course.store.ts
        private messagesService: MessageService      // We cannot inject the messageService here because this component is in a completely different branch of the component tree and cannot use the messageService (the one at root level). It would throw an error: No provider for message service. Unless we declare it in the providers array, meaning that the messageService that's being injected in the constructor now is an instance at component level.
        ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });
    // Added just for demonstration purposes
    // this.loadingService.loadingOn();  // Despite the 2 instances of the loadingService are created we dont see the loading spinner when clicking on the edit button, and that's because this instance of the loading service that we are using here inside the dialog is not connected to any loading indicator in this particular branch of the angular component tree. So we need to connect it to a loading indicator instance, that's why we added <loading></loading> component here in the template
    }                                 // We have nao 2 loading indicators instances, one at the application level and one at the component level.

    ngAfterViewInit() {

    }

    save() {

      const changes = this.form.value;

      // Removed in favor of the course.store.ts
      //  const saveCourses$ = this.courseStore.saveCourse(this.course.id, changes)
      //   .pipe(
      //     catchError(err => {
      //       const message = "Could not save course";
      //       this.messagesService.showErrors(message);
      //       console.log(message, err);      // To leave some error trace in the log, but a friendly message to the user
      //       return throwError(err);
      //     })
      // )
      // Version using course.store.ts
         this.courseStore.saveCourse(this.course.id, changes) // Removed const saveCourses$ in favor of the course.store.ts
        .subscribe();      // Added in favor of the course.store.ts
      this.dialogRef.close(changes);
      // this.loadingService.showLoaderUntilComplete(saveCourses$) // Giving this observables the loading capabilities
      //   .subscribe(
      //     (val) => {
      //       this.dialogRef.close(val);
      //     }
      //   )

    }

    close() {
        this.dialogRef.close();
    }

}
