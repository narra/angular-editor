/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Observable, Subject} from 'rxjs';
import {Event} from '@app/models/event';

export abstract class Publisher<T> {
  private eventSubject: Subject<Event<T>>;

  constructor() {
    this.eventSubject = new Subject<Event<T>>();
  }

  protected broadcast(event: Event<T>): void {
    this.eventSubject.next(event);
  }

  public register(): Observable<Event<T>> {
    return this.eventSubject.asObservable();
  }
}
