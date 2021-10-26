/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Navigation} from '@app/models';
import {NavigationType, RelationType} from '@app/enums';
import {ParamMap} from '@angular/router';

export class TextNavigation extends Navigation {

  constructor(params: ParamMap) {
    super();
    // initialize navigation
    this.addElements([
      {
        title: 'Text',
        type: NavigationType.internal,
        segments: ['/items', params.get('id'), 'main'],
        target: undefined,
        allow: []
      },
      {
        title: 'Metadata',
        type: NavigationType.internal,
        segments: ['/items', params.get('id'), 'metadata'],
        target: undefined,
        allow: []
      },
    ]);
  }
}
