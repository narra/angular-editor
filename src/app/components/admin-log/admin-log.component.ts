/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit} from '@angular/core';
import {narra} from '@narra/api';
import {AdminNavigationService} from '@app/navigation';
import {BreadcrumbService} from '@app/services';
import {ArrayHelper} from '@app/helpers';

@Component({
  selector: 'app-admin-log',
  templateUrl: './admin-log.component.html',
  styleUrls: ['./admin-log.component.scss']
})
export class AdminLogComponent implements OnInit {

  // public
  public loading: boolean;
  public logs: narra.Log[];

  constructor(
    private systemService: narra.SystemService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.systemService.getLogs().subscribe((response) => {
      // get log array
      this.logs = ArrayHelper.sort('name', response.logs);
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }
}
