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

import {Component, OnInit} from '@angular/core';
import {version} from '../../../../package.json';
import {forkJoin} from 'rxjs';
import {AdminNavigationService} from '@app/navigation';
import {narra} from '@narra/api';
import {BreadcrumbService} from '@app/services';

@Component({
  selector: 'app-admin-system',
  templateUrl: './admin-system.component.html',
  styleUrls: ['./admin-system.component.scss']
})
export class AdminSystemComponent implements OnInit {

  // public
  public loading: boolean;
  public coreVersion: string;
  public editorVersion: string;
  public modules: narra.Module[];

  constructor(
    private systemService: narra.SystemService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.loading = true;
    this.editorVersion = version;
  }

  ngOnInit() {
    forkJoin([
      this.systemService.getVersion(),
      this.systemService.getModules()
    ]).subscribe(results => {
      // version
      this.coreVersion = results[0].version;
      // modules
      this.modules = results[1].modules;
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }
}
