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
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthService, BreadcrumbService, EventService} from '@app/services';
import {LibrariesNavigation} from '@app/navigation';
import {EventType, RelationType} from '@app/enums';
import {RelationHelper} from '@app/helpers';
import {forkJoin, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-libraries-main',
  templateUrl: './libraries-main.component.html',
  styleUrls: ['./libraries-main.component.scss']
})
export class LibrariesMainComponent implements OnInit, OnDestroy {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public library: narra.Library;
  public items: narra.Item[];
  public relation: RelationType;

  // private
  private params: ParamMap;
  private subscription: Subscription;

  constructor(
    private narraLibraryService: narra.LibraryService,
    private eventService: EventService,
    private authService: AuthService,
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
    // subscribe to events
    this.subscription = this.eventService.register().subscribe((event) => {
      switch (event.type) {
        case EventType.library_updated:
          // reload all
          this._load();
          break;
        case EventType.item_updated:
          // reload just items
          this.narraLibraryService.getItems(this.library.id).subscribe((response) => {
            this.items = response.items;
          });
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
      // process
      forkJoin([this.narraLibraryService.getItems(this.params.get('id'))]).subscribe(results => {
        // get items
        this.items = results[0].items;
        // loading done
        this.loading = false;
      });
    });
  }
}
