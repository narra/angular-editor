/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
      this.item = response.item;
      // update breadcrumbs
      this.breadcrumbsService.updateItem(this.item.id, this.item.name);
      // load actions

      // loading done
      this.loading = false;
    });
  }
}
