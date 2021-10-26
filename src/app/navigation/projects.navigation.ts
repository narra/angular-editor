/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Navigation} from '@app/models';
import {NavigationType, RelationType} from '@app/enums';
import {ParamMap} from '@angular/router';

export class ProjectsNavigation extends Navigation {

  constructor(params: ParamMap) {
    super();
    // initialize navigation
    this.addElements([
      {
        title: 'Project',
        type: NavigationType.internal,
        segments: ['/projects', params.get('name'), 'main'],
        target: undefined,
        allow: []
      },
      {
        title: 'Contributors',
        type: NavigationType.internal,
        segments: ['/projects', params.get('name'), 'contributors'],
        target: undefined,
        allow: [RelationType.owned]
      },
      {
        title: 'Metadata',
        type: NavigationType.internal,
        segments: ['/projects', params.get('name'), 'metadata'],
        target: undefined,
        allow: [RelationType.owned, RelationType.contributed]
      },
      {
        title: 'Settings',
        type: NavigationType.internal,
        segments: ['/projects', params.get('name'), 'settings'],
        target: undefined,
        allow: [RelationType.owned, RelationType.contributed]
      }
    ]);
  }
}
