/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {MessageService} from '@app/services';
import {narra} from '@narra/api';

export class ErrorHelper {

  constructor(
    private messagesService: MessageService) {
  }

  protected handleError(errors: narra.Error[]) {
    errors.forEach((error) => {
      this.messagesService.error(error.message, error.trace);
    });
  }
}
