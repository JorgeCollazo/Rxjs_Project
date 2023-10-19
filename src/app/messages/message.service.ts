import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {filter} from "rxjs/operators";

// As the loading service we are not going to declare this service as a singleton, we'll have different message service
// instances in our application each one linked to a particular component (1 linked to the application root component
// and other to our Edit dialog component)

@Injectable(
//   {
//   providedIn: 'root'       (Read above)
// }
)
export class MessageService {

  private subject = new BehaviorSubject<string[]>([])

  errors$: Observable<string[]> = this.subject.asObservable() // Here errors Observable is going to emit the same values as subject but is cannot emit new values directly, we can only subscribe to them
    .pipe(
      filter(message => message &&  message.length > 0) // To discard the first initial empty array
    )
  constructor() { }

  showErrors(...errors: string[]) {
    this.subject.next(errors);          // Whenever this method gets called, the subject is going to emit values, so the errors$ observable as well.
  }

}
