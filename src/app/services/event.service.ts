/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Injectable} from '@angular/core';
import {Event} from '@app/models';
import {EventType, UserPreferencesType} from '@app/enums';
import {Publisher} from '@app/models/publisher';
import {narra} from '@narra/api';

@Injectable({
  providedIn: 'root'
})
export class EventService extends Publisher<any> {

  constructor() {
    // initialize publisher
    super();
  }

  public broadcastEvent(type: EventType): void {
    this.broadcast(Event.simple(type));
  }

  public broadcastEvents(types: EventType[]): void {
    types.forEach(type => {
      this.broadcast(Event.simple(type));
    });
  }

  public broadcastProjectEvent(project: narra.Project, type: EventType): void {
    this.broadcast(Event.complex<narra.Project>(type, project));
  }

  public broadcastLibraryEvent(library: narra.Library, type: EventType): void {
    this.broadcast(Event.complex<narra.Library>(type, library));
  }

  public broadcastItemEvent(item: narra.Item, type: EventType): void {
    this.broadcast(Event.complex<narra.Item>(type, item));
  }

  public broadcastUserPreferencesEvent(userPreferencesType: UserPreferencesType, type: EventType) {
    this.broadcast(Event.complex<UserPreferencesType>(type, userPreferencesType));
  }
}
