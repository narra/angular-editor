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
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LibrariesNavigation} from '@app/navigation';
import {forkJoin, Observable} from 'rxjs';
import {RelationHelper, ScenarioHelper} from '@app/helpers';
import {AuthService, BreadcrumbService, EventService} from '@app/services';
import {EventType, RelationType} from '@app/enums';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-libraries-settings',
  templateUrl: './libraries-settings.component.html',
  styleUrls: ['./libraries-settings.component.scss']
})
export class LibrariesSettingsComponent implements OnInit {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public library: narra.Library;
  public scenarios: narra.Scenario[];
  public changed: boolean;
  public delete: boolean;
  public relation: RelationType;
  public RelationType = RelationType;

  // private
  private cache: narra.Library;
  private params: ParamMap;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private libraryService: narra.LibraryService,
    private scenarioService: narra.ScenarioService,
    private projectService: narra.ProjectService,
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
      this.navigation = new LibrariesNavigation(params);
      // load
      this._load();
    });
  }

  private _load(): void {
    // process
    forkJoin([
      this.libraryService.getLibrary(this.params.get('id')),
      this.scenarioService.getScenarios()
    ]).subscribe((responses) => {
      // get project
      this.library = responses[0].library;
      // get scenations
      this.scenarios = ScenarioHelper.filterInclude(responses[1].scenarios, narra.ScenarioType.library);
      // save to cache
      this.cache = cloneDeep(this.library);
      // breadcrumbs
      this.breadcrumbsService.updateLibrary(this.library.id, this.library.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.library, this.authService.user);
      // loading done
      this.loading = false;
      // set changed flag
      this.changed = false;
    });
  }

  public _modelChanged() {
    this.changed = !(this.library.scenario.id === this.cache.scenario.id) || !(this.library.shared === this.cache.shared);
  }

  public _updateLibrary() {
    // set loading flag
    this.loading = true;
    // update project
    this.libraryService.updateLibrary(this.library).subscribe((response) => {
      // reload data
      this._load();
    });
  }

  public _deleteLibrary() {
    // set loading flag
    this.loading = true;
    // close dialog
    this.delete = false;
    // delete project
    this.libraryService.deleteLibrary(this.library.id).subscribe((response) => {
      // redirect to dashboard
      if (response.id === this.library.id) {
        // broadcast event
        this.eventService.broadcastLibraryEvent(this.library, EventType.library_deleted);
        // redirect to project or libraries dashboard
        if (this.breadcrumbsService.project) {
          this.router.navigate(['projects', this.breadcrumbsService.project]);
        } else {
          this.router.navigate(['libraries']);
        }
      }
    });
  }
}
