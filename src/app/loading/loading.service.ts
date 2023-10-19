import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {concatMap, finalize, tap} from "rxjs/operators";

@Injectable(
  // {
  //   providedIn: 'root'    It wont be this way because we want to have several instances of this service, so we need to define where our service will be available in our dependency injection tree. (providers array in the app component)
  // }
)
export class LoadingService {

  // With this we're clearly separating the ability to separate subscribing to new values from the capability of emitting new values
  private loadingSubject = new BehaviorSubject<boolean>(false); // You could use Subject class, but this one is a special type of subject that remembers the last value emitted by the subject, so any new subscribers are going to receive the last value emitted or the initial in case no other values were emitted before

  isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    console.log("Loading service created ..."); // You will be able to see this log either loading the page or clicking on the edit button
  }

  showLoaderUntilComplete<T>(obs$: Observable<T>): Observable<T> {  // Read this ant the note below to understand better
    return of(null)          // of factory operator, this observable created here is going to emit a value, and this value is going to be used to trigger the loading indicator, it was created to create an observable chain
      .pipe(
        tap(()  => this.loadingOn()),    // This is used to trigger a side effect (trigger the loading indicator in this case)
        concatMap(() => obs$),     // To switch between values emitted by of() and obs$ observable, right after calling the loadingOn() method we use this operator to switch to outputting the values emitted by the input Observable (obs$)
        finalize(() => this.loadingOff())        // To notify that our observable has ended its lifecycle, when the input observable stops emmitting values and completes we call the loadingOff() method
      )                                  // concatMap is going to take the values emitted by the source observable (of), which only emits the values emitted by null and then is completes immediately, and concatMap transforms this value into a new observable, which is going to be our input observable (obs$).
  }                                      // This means that the values emitted by the result observable are going to be identical to the values emitted by the input observable, with the exception that the loading indicator has already turned on

// This way the values emitted by the the subject are also going to be emitted by the observable
  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}

// Note
//  The main advantage of this design with this of(null) source observable is that the loading indicator will only be turn on when the resulting observable returned by showLoaderIndicatorUntilCompleted is subscribed to.
//  This means that the loading indicator is going to be shown or hidden in a way that is completely linked to the lifecycle of the return observable, only when the returned observable gets subscribed to, will the loading
//  indicator became ON and only when the returned observable finishes its lifecycle will the loading indicator be turned off

