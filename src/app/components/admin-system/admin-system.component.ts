/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit} from '@angular/core';
import packageInfo from '../../../../package.json';
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
    this.editorVersion = packageInfo.version;
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
