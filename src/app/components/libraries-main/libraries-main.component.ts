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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthService, BreadcrumbService, EventService} from '@app/services';
import {LibrariesNavigation} from '@app/navigation';
import {EventType, RelationType} from '@app/enums';
import {RelationHelper} from '@app/helpers';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {ClrDatagridStateInterface} from '@clr/angular';

@Component({
  selector: 'app-libraries-main',
  templateUrl: './libraries-main.component.html',
  styleUrls: ['./libraries-main.component.scss']
})
export class LibrariesMainComponent implements OnInit, OnDestroy {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public refreshing: boolean;
  public library: narra.Library;
  public items: narra.Item[];
  public pagination: narra.Pagination;
  public relation: RelationType;

  // private
  private params: ParamMap;
  private subscription: Subscription;

  constructor(
    private narraLibraryService: narra.LibraryService,
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
    this.refreshing = true;
    this.relation = RelationType.owned;
    this.pagination = {page: 1, perPage: 50, offset: 0} as narra.Pagination;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // get params
      this.params = params;
      // load navigation
      this.navigation = new LibrariesNavigation(params);
      // test
      this.route.queryParamMap.subscribe((queryParams) => {
        // check for pagination page
        if (queryParams.get('page')) {
          this.pagination.page = Number(queryParams.get('page'));
        }
        // check for pagination size
        if (queryParams.get('perPage')) {
          this.pagination.perPage = Number(queryParams.get('perPage'));
        }
        // check for pagination size
        if (queryParams.get('offset')) {
          this.pagination.offset = Number(queryParams.get('offset'));
        }
      });
      // load
      this._load();
    });
    // subscribe to events
    this.subscription = this.eventService.register().subscribe((event) => {
      switch (event.type) {
        case EventType.library_updated:
          // reload all
          this._load();
          break;
        case EventType.item_updated:
          // refresh items
          this.refresh();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private _load(): void {
    // set loading flag
    this.loading = true;
    // observerables
    this.narraLibraryService.getLibrary(this.params.get('id')).subscribe((response) => {
      // get library
      this.library = response.library;
      // breadcrumbs;
      this.breadcrumbsService.updateLibrary(this.library.id, this.library.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.library, this.authService.user);
      // loading done
      this.loading = false;
    });
  }

  public refresh(state?: ClrDatagridStateInterface) {
    // start refreshing
    this.refreshing = true;
    // update pagination
    if (state) {
      // update from state
      this.pagination.page = state.page.current;
      this.pagination.perPage = state.page.size;
      // update breadcrumbs and query
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {page: this.pagination.page, perPage: this.pagination.perPage, offset: this.pagination.offset},
          queryParamsHandling: 'merge'
        });
      this.breadcrumbsService.updateLibrary(this.library.id, this.library.name, this.pagination);
    }
    // refresh
    this.narraLibraryService.getItems(this.library.id, undefined, this.pagination).subscribe((response) => {
      // get items
      this.items = response.items;
      this.pagination = response.pagination;
      // stop refreshing
      this.refreshing = false;
    });
  }
}
