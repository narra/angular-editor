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
import {AuthService} from '@app/services';
import {Navigation} from '@app/models';
import {EventType, NavigationType, TargetType} from '@app/enums';
import {narra} from '@narra/api';

@Injectable({
  providedIn: 'root'
})
export class AdminNavigationService extends Navigation {

  constructor(private serverService: narra.ServerService, private authService: AuthService) {
    // initialize
    super();
    // subscribe for login
    this.authService.register().subscribe(event => {
      if (event.type === EventType.auth_login) {
        this._reload();
      }
    });
    // load default
    this._load();
  }

  private _load(): void {
    // navigation
    this.addElements([
      {
        title: 'System',
        type: NavigationType.internal,
        segments: ['/admin', 'system'],
        target: undefined,
        allow: []
      },
      {
        title: 'Connectors',
        type: NavigationType.internal,
        segments: ['/admin', 'connectors'],
        target: undefined,
        allow: []
      },
      {
        title: 'Generators',
        type: NavigationType.internal,
        segments: ['/admin', 'generators'],
        target: undefined,
        allow: []
      },
      {
        title: 'Synthesizers',
        type: NavigationType.internal,
        segments: ['/admin', 'synthesizers'],
        target: undefined,
        allow: []
      },
      {
        title: 'Users',
        type: NavigationType.internal,
        segments: ['/admin', 'users'],
        target: undefined,
        allow: []
      },
      {
        title: 'Settings',
        type: NavigationType.internal,
        segments: ['/admin', 'settings'],
        target: undefined,
        allow: []
      },
      {
        title: 'Workers',
        type: NavigationType.extenral,
        segments: [this._getWorkersSegment()],
        target: TargetType.blank,
        allow: []
      }
    ]);
  }

  private _reload(): void {
    this.elements[this.elements.length - 1].segments = [this._getWorkersSegment()];
  }

  private _getWorkersSegment(): string {
    return this.serverService.apiServer + '/service/workers?token=' + this.authService.getToken();
  }
}
