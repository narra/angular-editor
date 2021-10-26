/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit} from '@angular/core';
import {narra} from '@narra/api';
import {AdminNavigationService} from '@app/navigation';
import {BreadcrumbService} from '@app/services';

@Component({
  selector: 'app-admin-actions',
  templateUrl: './admin-actions.component.html',
  styleUrls: ['./admin-actions.component.scss']
})
export class AdminActionsComponent implements OnInit {

  // public
  public loading: boolean;
  public actions: narra.Action[];

  constructor(
    private actionService: narra.ActionService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.actionService.getActions().subscribe((response) => {
      // connectors
      this.actions = response.actions;
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }
}
