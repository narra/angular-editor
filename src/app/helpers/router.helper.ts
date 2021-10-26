/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Router} from '@angular/router';

export class RouterHelper {

  static resolveCurrentRouteSegments(router: Router): string[] {
    return router.url.split('/').filter(segment => {
      return segment.trim();
    });
  }
}
