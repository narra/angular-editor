/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AddService, AuthService, DispatcherService, EventService, UserPreferencesService} from '@app/services';
import {UserHelper} from '@app/helpers';
import {narra} from '@narra/api';
import {Subscription, timer} from 'rxjs';
import {EventType} from '@app/enums';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // public
  public UserHelper = UserHelper;
  public narraEventStatus = narra.EventStatus;
  public events: narra.Event[];

  // private
  private subscriptionDispatcher: Subscription;

  constructor(
    public authService: AuthService,
    public addService: AddService,
    public dispatcherService: DispatcherService,
    public narraEventService: narra.EventService,
    public eventService: EventService,
    public userPreferencesService: UserPreferencesService
  ) {
    this.events = [];
  }

  ngOnInit(): void {
    this.subscriptionDispatcher = this.dispatcherService.register().subscribe((event) => {
      // update events
      this.events = event.content;
    });
  }

  ngOnDestroy() {
    this.subscriptionDispatcher.unsubscribe();
  }

  public getEventTitle(event: narra.Event): string {
    // select per existence of any object
    if (event.item) {
      return event.item.name;
    } else if (event.library) {
      return event.library.name;
    } else if (event.project) {
      return event.project.name;
    } else {
      return event.message;
    }
  }
}
