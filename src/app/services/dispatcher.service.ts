/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Injectable} from '@angular/core';
import {narra} from '@narra/api';
import {Subscription, timer} from 'rxjs';
import {EventService} from '@app/services/event.service';
import {EventType} from '@app/enums';
import {AuthService} from '@app/services/auth.service';
import {takeWhile} from 'rxjs/operators';
import {Event, Publisher} from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class DispatcherService extends Publisher<narra.Event[]> {

  private eventsContainer: narra.Event[];
  private subscriptionEvent: Subscription;
  private subsctiptionAuth: Subscription;

  private eventsFlag = false;
  private authFlag = false;
  private lastState = 0;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private narraEventService: narra.EventService,
  ) {
    // initialize publisher
    super();
    // subscribe to events
    this.subscriptionEvent = this.eventService.register().subscribe((event) => {
      // check event type
      if ([EventType.item_created, EventType.library_deleted, EventType.library_cleaned, EventType.action_performed].includes(event.type)) {
        // reload if not running
        if (!this.eventsFlag) {
          this.refresh();
        }
      }
    });
    // subscribe to auth
    this.subsctiptionAuth = this.authService.register().subscribe((event) => {
      // update flag
      if (event.type === EventType.auth_login) {
        this.authFlag = true;
        // initial load
        this.refresh();
      }
    });
  }

  public get events(): narra.Event[] {
    return this.eventsContainer;
  }

  private refresh(): void {
// check for auth
    if (this.authFlag) {
      // repeat flag initially set to 1
      this.eventsFlag = true;
      // check for events in repeat of 10 seconds
      timer(1000, 5000).pipe(takeWhile(() => this.eventsFlag)).subscribe(() => {
        this.narraEventService.getEvents().subscribe((response) => {
          // update events
          this.eventsContainer = response.events;
          // disable timer if no events
          if (this.events.length === 0) {
            this.eventsFlag = false;
          }
          // fire event when changed
          // TODO: better change recognition based on ids
          if (this.lastState !== this.events.length) {
            // save state
            this.lastState = this.events.length;
            // fire event
            this.broadcast(Event.complex(EventType.events_updated, this.events));
          }
        });
      });
    }
  }
}
