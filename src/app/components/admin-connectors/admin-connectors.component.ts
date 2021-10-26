/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit} from '@angular/core';
import {AdminNavigationService} from '@app/navigation';
import {narra} from '@narra/api';
import {BreadcrumbService} from '@app/services';

@Component({
  selector: 'app-admin-connectors',
  templateUrl: './admin-connectors.component.html',
  styleUrls: ['./admin-connectors.component.scss']
})
export class AdminConnectorsComponent implements OnInit {

  // public
  public loading: boolean;
  public connectors: narra.Connector[];

  constructor(
    private connectorService: narra.ConnectorService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService) {
    this.loading = true;
  }

  ngOnInit() {
      this.connectorService.getConnectors().subscribe((response) => {
      // connectors
      this.connectors = response.connectors;
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }
}
