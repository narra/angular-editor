/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
