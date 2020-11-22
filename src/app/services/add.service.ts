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
import {EventType} from '@app/enums';
import {Publisher} from '@app/models/publisher';

@Injectable({
  providedIn: 'root'
})
export class AddService extends Publisher<any> {

  constructor() {
    // initialize publisher
    super();
  }

  public createProject(): void {
    this.broadcast(Event.simple(EventType.create_project));
  }

  public createLibrary(): void {
    this.broadcast(Event.simple(EventType.create_library));
  }

  public createScenario(): void {
    this.broadcast(Event.simple(EventType.create_scenario));
  }

  public createItem(): void {
    this.broadcast(Event.simple(EventType.create_item));
  }

  public addLibrary(): void {
    this.broadcast(Event.simple(EventType.add_library));
  }
}
