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
