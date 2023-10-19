import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {Observable, BehaviorSubject} from "rxjs";
import {map, shareReplay, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

const AUTH_DATA = "auth_data";

@Injectable({
  providedIn: 'root'
})

export class AuthStore {

  private subject = new BehaviorSubject<User | null>(null);

  user$: Observable<User | null> = this.subject.asObservable();  // This will emmit the user returned from the login method

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));                  // This will emmit true when login
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));    // This will emmit false when login
    const user = localStorage.getItem(AUTH_DATA);

    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.post<User | null>("/api/login", {email, password})
      .pipe(
        tap(user => {
          this.subject.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user)); // This way user profile will survive refreshes
        }), // Is going to emmit the user returned value
        shareReplay()
      )
  }

  logout() {
    this.subject.next(null);  // Here occurs the same as the login but the opposite
    localStorage.removeItem(AUTH_DATA);
  }

}


















