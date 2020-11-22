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
