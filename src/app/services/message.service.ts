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
import {EventType, MessageType} from '@app/enums';
import {Message} from '@app/models/message';
import {Event, Publisher} from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends Publisher<Message> {

  constructor() {
    // initialize publisher
    super();
  }

  private message(message: Message): void {
    // send message
    this.broadcast(Event.complex(EventType.message, message));
  }

  // convenience methods
  public success(message: string) {
      this.message(new Message({ close: true, type: MessageType.success, message }));
  }

  public error(message: string, trace?: string[]) {
    if (trace) {
      this.message(new Message({close: false, type: MessageType.error, message, trace}));
    } else {
      this.message(new Message({close: false, type: MessageType.error, message}));
    }
  }

  public info(message: string) {
    this.message(new Message({ close: true, type: MessageType.info, message }));
  }

  public warn(message: string) {
    this.message(new Message({ close: false, type: MessageType.warning, message }));
  }
}
