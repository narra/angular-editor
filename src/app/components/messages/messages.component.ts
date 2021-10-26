/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
        case EventType.project_updated:
          this.messagesService.success(`Project ${event.content.name} successfuly updated.`);
          break;
        case EventType.project_created:
          this.messagesService.success(`Project ${event.content.name} successfuly created.`);
          break;
        case EventType.project_deleted:
          this.messagesService.success(`Project ${event.content.name} successfuly deleted.`);
          break;
        case EventType.library_updated:
          this.messagesService.success(`Library ${event.content.name} successfuly updated.`);
          break;
        case EventType.library_created:
          this.messagesService.success(`Library ${event.content.name} successfuly created.`);
          break;
        case EventType.library_deleted:
          this.messagesService.success(`Library ${event.content.name} successfuly deleted.`);
          break;
        case EventType.library_cleaned:
          this.messagesService.success(`Library ${event.content.name} successfuly cleaned.`);
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
