import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


import {Router} from '@angular/router';
import {AuthStore} from "../services/auth.store";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthStore
  ) {

    this.form = fb.group({
      email: ['test@angular-university.io', [Validators.required]],
      password: ['test', [Validators.required]]
    });

  }

  ngOnInit() {

  }

  login() {
    const val = this.form.value;

    this.auth.login(val.email, val.password)
      .subscribe(
        // () => {},        // Older approach, using callback arguments
        // err => console.log(err)
        {         // Recommended approach, Instead of passing separate callback arguments (next, error, and complete) in the subscribe() method, pass an observer object to the subscribe() method.
          next: response => {
            this.router.navigateByUrl("/courses")
          },
          error: error => {
            alert("Login failed!")
          }
        }
      )
  }
}
