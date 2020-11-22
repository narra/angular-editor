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
