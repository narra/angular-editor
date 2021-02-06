/**
 * @license
 *
 * Copyright (C) 2020 narra.eu
 *
 * This file is part of Narra Editor.
 *
 * Narra Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Narra Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Narra Angular API. If not, see <http://www.gnu.org/licenses/>.
 *
 * Authors: Michal Mocnak <michal@narra.eu>
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Message} from '@app/models/message';
import {EventType, MessageType} from '@app/enums';
import {EventService, MessageService} from '@app/services';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  // public
  public messages: Message[] = [];
  public detailsOpen: boolean;
  public detailsMessage: Message;

  // private
  private messagesSubscription: Subscription;
  private eventsSubscription: Subscription;

  constructor(
    private messagesService: MessageService,
    private eventService: EventService
  ) {
    this.detailsOpen = false;
    this.detailsMessage = new Message({trace: []});
  }

  ngOnInit(): void {
    // subscribe to new alert notifications
    this.messagesSubscription = this.messagesService.register().subscribe((event) => {
      if (event.type === EventType.message) {
        // push into container
        this.messages.push(event.content);
        // auto close message if required
        if (event.content.close) {
          setTimeout(() => this.removeMessage(event.content), 5000);
        }
      }
    });
    // subscibe to events to automatically send messages
    this.eventsSubscription = this.eventService.register().subscribe((event) => {
      switch (event.type) {
        case EventType.project_created:
          this.messagesService.success(`Project ${event.content.name} successfuly created.`);
          break;
        case EventType.project_deleted:
          this.messagesService.success(`Project ${event.content.name} successfuly deleted.`);
          break;
        case EventType.library_created:
          this.messagesService.success(`Library ${event.content.name} successfuly created.`);
          break;
        case EventType.library_deleted:
          this.messagesService.success(`Library ${event.content.name} successfuly deleted.`);
          break;
      }
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
  }

  public removeMessage(message: Message) {
    // check if already removed to prevent error on auto close
    if (this.messages.includes(message)) {
      // remove alert
      this.messages = this.messages.filter((m) => m !== message);
    }
  }

  public showDetails(message: Message) {
    // open dialog
    this.detailsOpen = true;
    // set message
    this.detailsMessage = message;
  }
}
