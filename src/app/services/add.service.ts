/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
