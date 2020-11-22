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
import {AuthService, BreadcrumbService} from '@app/services';
import {Subscription} from 'rxjs';
import {EventType} from '@app/enums';
import {Breadcrumb} from '@app/models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  // public
  public breadcrumb: Breadcrumb;

  // private
  private subscription: Subscription;

  constructor(
    public authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.breadcrumbService.register().subscribe((event) => {
      if (event.type === EventType.navigation_changed) {
        this.breadcrumb = event.content;
      }
    });
    // check for link
    this.route.queryParamMap.subscribe((query) => {
      // get link
      if (query.get('link')) {
        this.breadcrumb = this.breadcrumbService.decode(query.get('link'));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getDashboardLink() {
    if (this.breadcrumb.project === undefined) {
      return ['/libraries'];
    } else {
      return ['/projects'];
    }
  }
}
