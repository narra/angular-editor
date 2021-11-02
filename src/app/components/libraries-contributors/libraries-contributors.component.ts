/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit} from '@angular/core';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {LibrariesNavigation} from '@app/navigation';
import {forkJoin, Observable} from 'rxjs';
import {ArrayHelper, RelationHelper, UserHelper} from '@app/helpers';
import {AuthService, BreadcrumbService} from '@app/services';
import cloneDeep from 'lodash/cloneDeep';
import {RelationType} from '@app/enums';

@Component({
  selector: 'app-libraries-contributors',
  templateUrl: './libraries-contributors.component.html',
  styleUrls: ['./libraries-contributors.component.scss']
})
export class LibrariesContributorsComponent implements OnInit {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public library: narra.Library;
  public users: narra.User[];
  public changed: boolean;
  public relation: RelationType;

  // private
  private cache: narra.Library;
  private params: ParamMap;

  constructor(
    private authService: AuthService,
    private libraryService: narra.LibraryService,
    private userService: narra.UserService,
    private projectService: narra.ProjectService,
    private route: ActivatedRoute,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
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
      this.userService.getUsers()
    ]).subscribe((responses) => {
      // get project
      this.library = responses[0].library;
      // store users
      this.users = UserHelper.filterExclude(responses[1].users, [this.library.author]);
      // prepare contributors
      // workaround dor clarity datagrid
      this.library.contributors = UserHelper.filterInclude(this.users, this.library.contributors);
      // save to cache
      this.cache = cloneDeep(this.library);
      // breadcrumbs
      this.breadcrumbsService.updateLibrary(this.library.id, this.library.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.library, this.authService.user);
      // set changed flag
      this.changed = false;
      // loading done
      this.loading = false;
    });
  }

  public _modelChanged() {
    this.changed = !ArrayHelper.isEqual(
      ArrayHelper.pluck(this.library.contributors, 'id'),
      ArrayHelper.pluck(this.cache.contributors, 'id')
    );
  }

  public _updateLibrary() {
    // set loading flag
    this.loading = true;
    // update library
    this.libraryService.updateLibrary(this.library).subscribe(library => {
      // reload data
      this._load();
    });
  }
}
