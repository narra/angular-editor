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
  selector: 'app-admin-synthesizers',
  templateUrl: './admin-synthesizers.component.html',
  styleUrls: ['./admin-synthesizers.component.scss']
})
export class AdminSynthesizersComponent implements OnInit {

  // public
  public loading: boolean;
  public synthesizers: narra.Synthesizer[];

  constructor(
    private synthesizerService: narra.SynthesizerService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.synthesizerService.getSynthesizers().subscribe((response) => {
      // connectors
      this.synthesizers = response.synthesizers;
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }
}
