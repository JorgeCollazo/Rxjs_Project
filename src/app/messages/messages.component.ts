import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import {MessageService} from "./message.service";

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  showMessage: boolean = false;
  errors$: Observable<string[]> = new Observable<string[]>();

  constructor(public messagesServices: MessageService) {
    console.log("Created messages component");
  }

  ngOnInit() {
    this.errors$ = this.messagesServices.errors$
      .pipe(
        tap(() => this.showMessage = true)  // We dont want that an empty array trigger this function, so we changed that in the service
      )
  }

  onClose() {
    this.showMessage = false;
  }

}
