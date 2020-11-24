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

import {Component} from '@angular/core';
import {narra} from '@narra/api';
import {HttpClient} from '@angular/common/http';
import {Environment} from '@app/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private http: HttpClient,
    private narraServerService: narra.ServerService
  ) {
    // set propper API server based on environemnt variable
    this.http.get<Environment>('assets/environment.json').toPromise().then((env) => {
      // check if exists
      if (env.NARRA_API_HOSTNAME) {
        this.narraServerService.apiServer = `http://${env.NARRA_API_HOSTNAME}`;
      }
    });
  }
}
