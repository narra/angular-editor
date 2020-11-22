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
import {AddService, AuthService, BreadcrumbService, EventService, UserPreferencesService} from '@app/services';
import {EventType, RelationType, UserPreferencesType, WizardType} from '@app/enums';
import {Subscription} from 'rxjs';
import {narra} from '@narra/api';
import {ArrayHelper, RelationHelper, UserHelper} from '@app/helpers';

@Component({
  selector: 'app-libraries-dashboard',
  templateUrl: './libraries-dashboard.component.html',
  styleUrls: ['./libraries-dashboard.component.scss']
})
export class LibrariesDashboardComponent implements OnInit, OnDestroy {

  // public
  public loading: boolean;
  public libraries: narra.Library[];
  public WizardType = WizardType;
  public RelationType = RelationType;
  public RelationHelper = RelationHelper;

  // private
  private subscription: Subscription;

  constructor(
    private libraryService: narra.LibraryService,
    private authService: AuthService,
    private addService: AddService,
    private eventService: EventService,
    private userPreferencesService: UserPreferencesService,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    // subscribe for events
    this.subscription = this.eventService.register().subscribe(event => {
      // check event
      if (event.type === EventType.library_created || event.type === EventType.library_updated ||
        (event.type === EventType.user_preferences_updated && event.content === UserPreferencesType.superuser)) {
        // reload
        this._load();
      }
    });
    // load data
    this._load();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _load(): void {
    // reset load flag
    this.loading = true;
    // load projects
    this.libraryService.getLibraries().subscribe((response) => {
      // filter libraries
      if (UserHelper.isAdmin(this.authService.user) && this.userPreferencesService.superuser) {
        this.libraries = response.libraries;
      } else {
        this.libraries = ArrayHelper.filterIncludeAuthors<narra.Library>(response.libraries, [this.authService.user]);
      }
      // breadcrumbs
      this.breadcrumbsService.empty();
      // stop loading
      this.loading = false;
    });
  }
}
