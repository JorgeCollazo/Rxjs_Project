import {Component, OnInit} from '@angular/core';
import {LoadingService} from "./loading/loading.service";
import {MessageService} from "./messages/message.service";
import {AuthStore} from "./services/auth.store";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [  // They were moved to the module.ts file in order to be visible to the store.ts service
  //   LoadingService,    // Placing it here, we are telling that this service will be available only to our app component and its direct descendants. Not the case of our course-dialog component
  //   MessageService,    // We could have placed in the constructor as well but is more important to place this instance of message service here because it is going to be accessible to the application component template including its all child components including message component that were included here.
  // ]
})
export class AppComponent implements  OnInit {

    constructor(public auth: AuthStore) {

    }

    ngOnInit() {


    }

  logout() {
    this.auth.logout();
  }

}
