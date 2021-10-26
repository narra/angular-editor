/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
