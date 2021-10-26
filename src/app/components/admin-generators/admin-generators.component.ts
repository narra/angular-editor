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
  selector: 'app-admin-generators',
  templateUrl: './admin-generators.component.html',
  styleUrls: ['./admin-generators.component.scss']
})
export class AdminGeneratorsComponent implements OnInit {

  // public
  public loading: boolean;
  public generators: narra.Generator[];

  constructor(
    private generatorService: narra.GeneratorService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.generatorService.getGenerators().subscribe((response) => {
      // connectors
      this.generators = response.generators;
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }
}
