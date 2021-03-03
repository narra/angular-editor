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

import {Component, Input, OnInit} from '@angular/core';
import {Navigation, NavigationElement} from '@app/models';
import {NavigationType, RelationType} from '@app/enums';
import {AuthService, BreadcrumbService, UserPreferencesService} from '@app/services';
import {UserHelper} from '@app/helpers';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input('provider') provider: Navigation;
  @Input('relation') relation: RelationType;

  // public
  public NavigationType = NavigationType;
  public UserHelper = UserHelper;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private authService: AuthService,
    private userPreferencesService: UserPreferencesService
  ) {
  }

  public isRelated(element: NavigationElement): boolean {
    return element.allow.includes(this.relation);
  }

  ngOnInit() {
  }
}
