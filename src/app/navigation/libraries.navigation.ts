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

import {Navigation} from '@app/models';
import {NavigationType, RelationType} from '@app/enums';
import {ParamMap} from '@angular/router';

export class LibrariesNavigation extends Navigation {

  constructor(params: ParamMap) {
    super();
    // initialize navigation
    this.addElements([
      {
        title: 'Library',
        type: NavigationType.internal,
        segments: ['/libraries', params.get('id'), 'main'],
        target: undefined,
        allow: []
      },
      {
        title: 'Contributors',
        type: NavigationType.internal,
        segments: ['/libraries', params.get('id'), 'contributors'],
        target: undefined,
        allow: [RelationType.owned]
      },
      {
        title: 'Metadata',
        type: NavigationType.internal,
        segments: ['/libraries', params.get('id'), 'metadata'],
        target: undefined,
        allow: [RelationType.owned, RelationType.contributed]
      },
      {
        title: 'Settings',
        type: NavigationType.internal,
        segments: ['/libraries', params.get('id'), 'settings'],
        target: undefined,
        allow: [RelationType.owned, RelationType.contributed]
      }
    ]);
  }
}
