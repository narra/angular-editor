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
import {EventType} from '@app/enums';
import {AuthService, BreadcrumbService, EventService} from '@app/services';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TextNavigation} from '@app/navigation';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-items-main',
  templateUrl: './items-main.component.html',
  styleUrls: ['./items-main.component.scss']
})
export class ItemsMainComponent implements OnInit, OnDestroy {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public library: narra.Library;
  public item: narra.Item;
  public MetaHelper = narra.MetaHelper;

  // private
  private params: ParamMap;
  private subscription: Subscription;

  constructor(
    private narraItemService: narra.ItemService,
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // get params
      this.params = params;
      // load navigation
      this.navigation = new TextNavigation(params);
      // load
      this._load();
    });
    // subscribe to events
    this.subscription = this.eventService.register().subscribe(event => {
      switch (event.type) {
        case EventType.item_updated:
          // reload all
          this._load();
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
    // load data
    this.narraItemService.getItem(this.params.get('id')).subscribe((response) => {
      // get item
      this.item = response.item
      // update breadcrumbs
      this.breadcrumbsService.updateItem(this.item.id, this.item.name);
      // loading done
      this.loading = false;
    });
  }
}
