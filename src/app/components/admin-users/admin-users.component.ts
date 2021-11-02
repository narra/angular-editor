/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
    this.userService.deleteUser(user.id).subscribe((response) => {
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
