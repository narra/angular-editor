/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit} from '@angular/core';
import {WizardType} from '@app/enums';
import {narra} from '@narra/api';
import {BreadcrumbService} from '@app/services';

@Component({
  selector: 'app-scenarios-dashboard',
  templateUrl: './scenarios-dashboard.component.html',
  styleUrls: ['./scenarios-dashboard.component.scss']
})
export class ScenariosDashboardComponent implements OnInit {

  // public
  public loading: boolean;
  public scenarios: narra.Scenario[];
  public WizardType = WizardType;

  constructor(
    private scenarioService: narra.ScenarioService,
    private breadcrumbsService: BreadcrumbService
   ) {
    this.loading = true;
  }

  ngOnInit() {
    this.scenarioService.getScenarios().subscribe((response) => {
      // store projects
      this.scenarios = response.scenarios;
      // breadcrumbs
      this.breadcrumbsService.empty();
      // stop loading
      this.loading = false;
    });
  }
}
