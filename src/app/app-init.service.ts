/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {narra} from '@narra/api';
import {Environment} from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private http: HttpClient,
    private narraServerService: narra.ServerService
  ) {}

  public init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get<Environment>('assets/environment.json').toPromise().then((env) => {
        // check if exists
        if (env.NARRA_API_HOSTNAME) {
          // initialize server service with provided hostname
          this.narraServerService.initialize(`${env.NARRA_API_PROTOCOL}://${env.NARRA_API_HOSTNAME}`);
        } else {
          // default initialization
          this.narraServerService.initialize();
        }
        // resolve
        resolve();
      });
    });
  }
}
