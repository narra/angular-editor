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
import {AddService, AuthService, EventService, UserPreferencesService} from '@app/services';
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
  public events: narra.Event[];
  public UserHelper = UserHelper;
  public narraEventStatus = narra.EventStatus;

  // private
  private subscription: Subscription;
  private eventsFLag = false;

  constructor(
    public authService: AuthService,
    public addService: AddService,
    public narraEventService: narra.EventService,
    public eventService: EventService,
    public userPreferencesService: UserPreferencesService
  ) {
    this.events = [];
  }

  ngOnInit(): void {
    // subscribe to events
    this.subscription = this.eventService.register().subscribe((event) => {
      // check event type
      if ([EventType.item_created, EventType.library_deleted].includes(event.type)) {
        // reload if not running
        if (!this.eventsFLag) {
          this._load();
        }
      }
    });
    // initial load
    //this._load();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private _load(): void {
    // repeat flag initially set to 1
    this.eventsFLag = true;
    // check for events in repeat of 10 seconds
    timer(1000, 1000).pipe(takeWhile(() => this.eventsFLag)).subscribe(() => {
      this.narraEventService.getEvents().subscribe((response) => {
        // resolve done events
        const done = [this.events, response.events].reduce((a, b) => a.filter(c => !b.includes(c)));
        // update events
        this.events = response.events;
        // fire events for done tasks
        done.forEach((event) => {
          // check event state and type and fire appropriate event
          if (event.item) {
            this.eventService.broadcastItemEvent(event.item, EventType.item_updated);
          } else if (event.library) {
            this.eventService.broadcastLibraryEvent(event.library, EventType.library_updated);
          } else if (event.project) {
            this.eventService.broadcastProjectEvent(event.project, EventType.project_updated);
          }
        });
        // disable timer if no events
        if (this.events.length === 0) {
          this.eventsFLag = false;
        }
      });
    });
  }

  public getEventTitle(event: narra.Event): string {
    if (event.item) {
      return event.item.name;
    } else if (event.library) {
      return event.library.name;
    } else if (event.project) {
      return event.project.title;
    } else {
      return 'Undefined';
    }
  }
}
