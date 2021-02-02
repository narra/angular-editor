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
import {AdminNavigationService} from '@app/navigation';
import {narra} from '@narra/api';
import {AuthService, BreadcrumbService} from '@app/services';
import {UserHelper} from '@app/helpers';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  // public
  public loading: boolean;
  public delete: boolean;
  public users: narra.User[];
  public UserHelper = UserHelper;
  public RoleType = narra.RoleType;
  public Object = Object;

  constructor(
    private authService: AuthService,
    private userService: narra.UserService,
    public adminNavigationService: AdminNavigationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.loading = true;
    this.delete = false;
  }

  ngOnInit() {
    this._load();
  }

  private _load(): void {
    this.userService.getUsers().subscribe((response) => {
      // store users
      this.users = response.users;
      // breadcrumbs
      this.breadcrumbService.empty();
      // loading done
      this.loading = false;
    });
  }

  public _deleteUser(user: narra.User) {
    // set loading flag
    this.loading = true;
    // close dialog
    this.delete = false;
    // delete project
    this.userService.deleteUser(user.username).subscribe((response) => {
      // refresh
      this._load();
    });
  }

  public _updateUser(user: narra.User) {
    // set loading flag
    this.loading = true;
    // update project
    this.userService.updateUser(user).subscribe((response) => {
      // refresh
      this._load();
    });
  }
}
