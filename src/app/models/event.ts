/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {EventType} from '@app/enums';

export class Event<T> {
  type: EventType;
  content: T;

  private constructor(type: EventType, content: T) {
    this.type = type;
    this.content = content;
  }

  // Factory methods to create Event
  // Simple event without content
  static simple(type: EventType): Event<any> {
    // create simple event
    return new Event<any>(type, undefined);
  }
  // Complex event with content navigation
  static complex<T>(type: EventType, content: T): Event<T> {
    // create complex event
    return new Event<T>(type, content);
  }
}
