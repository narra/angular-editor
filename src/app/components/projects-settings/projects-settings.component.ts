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
import {Navigation} from '@app/models';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ProjectsNavigation} from '@app/navigation';
import {forkJoin} from 'rxjs';
import {ArrayHelper, RelationHelper, ScenarioHelper, UserHelper} from '@app/helpers';
import {narra} from '@narra/api';
import {AuthService, BreadcrumbService, EventService} from '@app/services';
import {EventType, RelationType} from '@app/enums';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-projects-settings',
  templateUrl: './projects-settings.component.html',
  styleUrls: ['./projects-settings.component.scss']
})
export class ProjectsSettingsComponent implements OnInit {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public project: narra.Project;
  public scenarios: narra.Scenario[];
  public changed: boolean;
  public delete: boolean;
  public relation: RelationType;
  public RelationType = RelationType;

  // private
  private cache: narra.Project;
  private params: ParamMap;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private projectService: narra.ProjectService,
    private scenarioService: narra.ScenarioService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
    this.delete = false;
    this.relation = RelationType.owned;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // get params
      this.params = params;
      // load navigation
      this.navigation = new ProjectsNavigation(params);
      // load
      this._load();
    });
  }

  private _load(): void {
    forkJoin([
      this.projectService.getProject(this.params.get('name')),
      this.scenarioService.getScenarios()
    ]).subscribe(results => {
      // get project
      this.project = results[0].project;
      // get scenations
      this.scenarios = ScenarioHelper.filterInclude(results[1].scenarios, narra.ScenarioType.project);
      // save to cache
      this.cache = cloneDeep(this.project);
      // breadcrumbs
      this.breadcrumbsService.updateProject(this.project.id, this.project.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.project, this.authService.user);
      // loading done
      this.loading = false;
      // set changed flag
      this.changed = false;
    });
  }

  public _modelChanged() {
    this.changed = !(this.project.scenario.id === this.cache.scenario.id) || !(this.project.public === this.cache.public);
  }

  public _updateProject() {
    // set loading flag
    this.loading = true;
    // update project
    this.projectService.updateProject(this.project).subscribe(project => {
      // broadcast event
      this.eventService.broadcastProjectEvent(this.project, EventType.project_updated);
      // reload data
      this._load();
    });
  }

  public _deleteProject() {
    // set loading flag
    this.loading = true;
    // close dialog
    this.delete = false;
    // delete project
    this.projectService.deleteProject(this.project.name).subscribe((response) => {
      // redirect to dashboard
      if (response.name === this.project.name) {
        // broadcast event
        this.eventService.broadcastProjectEvent(this.project, EventType.project_deleted);
        // redirect
        this.router.navigate(['projects']);
      }
    });
  }
}
