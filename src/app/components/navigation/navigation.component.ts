/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
