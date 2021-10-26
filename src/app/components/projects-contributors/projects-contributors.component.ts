/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
      ArrayHelper.pluck(this.project.contributors, 'email'),
      ArrayHelper.pluck(this.cache.contributors, 'email')
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
