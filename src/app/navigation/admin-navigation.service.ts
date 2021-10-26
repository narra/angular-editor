/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
        title: 'Logs',
        type: NavigationType.internal,
        segments: ['/admin', 'logs'],
        target: undefined,
        allow: []
      },
      {
        title: 'Actions',
        type: NavigationType.internal,
        segments: ['/admin', 'actions'],
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
        type: NavigationType.external,
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
