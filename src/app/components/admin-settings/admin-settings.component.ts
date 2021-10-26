/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { Component, OnInit } from '@angular/core';
import {narra} from '@narra/api';
import {AdminNavigationService} from '@app/navigation';
import {BreadcrumbService} from '@app/services';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  // public
  public loading: boolean;
  public settings: narra.Setting[];

  constructor(
    private settingService: narra.SettingService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService
    ) {
    this.loading = true;
  }

  ngOnInit() {
    this.settingService.getSettings().subscribe((response) => {
      // store settings
      this.settings = response.settings;
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }
}
