/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';
import {AddService, AuthService, BreadcrumbService, EventService} from '@app/services';
import {TextNavigation} from '@app/navigation';
import {EventType, RelationType} from '@app/enums';
import {RelationHelper} from '@app/helpers';

@Component({
  selector: 'app-items-metadata',
  templateUrl: './items-metadata.component.html',
  styleUrls: ['./items-metadata.component.scss']
})
export class ItemsMetadataComponent implements OnInit {
  @ViewChild('formAdd') formAdd: FormGroup;

  // public
  public navigation: Navigation;
  public loading: boolean;
  public item: narra.Item;
  public params: ParamMap;
  public relation: RelationType;
  public openAddDialog: boolean;
  public newMeta: Pick<narra.Meta, 'name' | 'value' | 'generator'>;
  public RelationType = RelationType;
  public RelationHelper = RelationHelper;

  // private
  private subscription: Subscription;

  constructor(
    private itemService: narra.ItemService,
    private authService: AuthService,
    private addService: AddService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
    this.openAddDialog = false;
    this.newMeta = this.emptyMetadata();
    this.relation = RelationType.owned;
  }

  ngOnInit(): void {
    // get params
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
      // check event type
      if (event.type === EventType.item_updated) {
        // reload
        this._load();
      }
    });
  }

  ngOnDestroy(): void {
    // unsubscribe
    this.subscription.unsubscribe();
  }

  private _load(): void {
    this.itemService.getItem(this.params.get('id')).subscribe((response) => {
      // get project
      this.item = response.item;
      // breadcrumbs
      this.breadcrumbsService.updateItem(this.item.id, this.item.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.item, this.authService.user);
      // clean new meta fields
      this.newMeta = this.emptyMetadata();
      // reset form
      this.formAdd.reset();
      // loading done
      this.loading = false;
    });
  }

  public emptyMetadata(): Pick<narra.Meta, 'name' | 'value' | 'generator'> {
    // create empty project
    return {
      name: '',
      value: '',
      generator: 'user'
    };
  }

  public _updateMeta(meta: narra.Meta): void {
    // set loading flag
    this.loading = true;
    // update project
    this.itemService.updateItemMeta(this.item.id, meta).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastItemEvent(this.item, EventType.item_updated);
      // reload data
      this._load();
    });
  }

  public _addMeta(): void {
    // closing dialog
    this.openAddDialog = false;
    // set loading flag
    this.loading = true;
    // update project
    this.itemService.addItemMeta(this.item.id, this.newMeta).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastItemEvent(this.item, EventType.item_updated);
      // reload data
      this._load();
    });
  }

  public _deleteMeta(meta: narra.Meta): void {
    // set loading flag
    this.loading = true;
    // update project
    this.itemService.deleteItemMeta(this.item.id, meta).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastItemEvent(this.item, EventType.item_updated);
      // reload data
      this._load();
    });
  }
}
