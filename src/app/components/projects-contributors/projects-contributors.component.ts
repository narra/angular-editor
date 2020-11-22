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
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ProjectsNavigation} from '@app/navigation';
import {forkJoin} from 'rxjs';
import {ArrayHelper, RelationHelper, UserHelper} from '@app/helpers';
import {narra} from '@narra/api';
import cloneDeep from 'lodash/cloneDeep';
import {RelationType} from '@app/enums';
import {AuthService} from '@app/services';

@Component({
  selector: 'app-projects-contributors',
  templateUrl: './projects-contributors.component.html',
  styleUrls: ['./projects-contributors.component.scss']
})
export class ProjectsContributorsComponent implements OnInit {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public project: narra.Project;
  public users: narra.User[];
  public changed: boolean;
  public relation: RelationType;

  // private
  private cache: narra.Project;
  private params: ParamMap;

  constructor(
    private authService: AuthService,
    private projectService: narra.ProjectService,
    private userService: narra.UserService,
    private route: ActivatedRoute,
  ) {
    this.loading = true;
    this.relation = RelationType.owned;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
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
      this.userService.getUsers()
    ]).subscribe(results => {
      // get project
      this.project = results[0].project;
      // store users
      this.users = UserHelper.filterExclude(results[1].users, [this.project.author]);
      // prepare contributors
      // workaround dor clarity datagrid
      this.project.contributors = UserHelper.filterInclude(this.users, this.project.contributors);
      // save to cache
      this.cache = cloneDeep(this.project);
      // relation
      this.relation = RelationHelper.getRelationship(this.project, this.authService.user);
      // set changed flag
      this.changed = false;
      // loading done
      this.loading = false;
    });
  }

  public _modelChanged() {
    this.changed = !ArrayHelper.isEqual(
      ArrayHelper.pluck(this.project.contributors, 'username'),
      ArrayHelper.pluck(this.cache.contributors, 'username')
    );
  }

  public _updateProject() {
    // set loading flag
    this.loading = true;
    // update project
    this.projectService.updateProject(this.project).subscribe(project => {
      // reload data
      this._load();
    });
  }
}
