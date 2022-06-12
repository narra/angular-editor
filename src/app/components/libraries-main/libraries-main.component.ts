/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthService, BreadcrumbService, EventService, MessageService} from '@app/services';
import {LibrariesNavigation} from '@app/navigation';
import {EventType, RelationType} from '@app/enums';
import {RelationHelper} from '@app/helpers';
import {forkJoin, Subscription, timer} from 'rxjs';
import {ClrDatagridStateInterface} from '@clr/angular';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-libraries-main',
  templateUrl: './libraries-main.component.html',
  styleUrls: ['./libraries-main.component.scss']
})
export class LibrariesMainComponent implements OnInit, OnDestroy {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public refreshing: boolean;
  public delete: boolean;
  public library: narra.Library;
  public items: narra.Item[];
  public actions: narra.Action[];
  public filteredActions: narra.Action[];
  public selected: narra.Item[];
  public pagination: narra.Pagination;
  public relation: RelationType;

  // private
  private params: ParamMap;
  private subscription: Subscription;

  constructor(
    private narraLibraryService: narra.LibraryService,
    private narraActionService: narra.ActionService,
    private narraEventService: narra.EventService,
    private narraReturnService: narra.ReturnService,
    private narraServerService: narra.ServerService,
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbsService: BreadcrumbService,
    private messageService: MessageService
  ) {
    this.loading = true;
    this.refreshing = true;
    this.delete = false;
    this.relation = RelationType.owned;
    this.selected = [];
    this.pagination = {page: 1, perPage: 50, offset: 0} as narra.Pagination;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // get params
      this.params = params;
      // load navigation
      this.navigation = new LibrariesNavigation(params);
      // test
      this.route.queryParamMap.subscribe((queryParams) => {
        // check for pagination page
        if (queryParams.get('page')) {
          this.pagination.page = Number(queryParams.get('page'));
        }
        // check for pagination size
        if (queryParams.get('perPage')) {
          this.pagination.perPage = Number(queryParams.get('perPage'));
        }
        // check for pagination size
        if (queryParams.get('offset')) {
          this.pagination.offset = Number(queryParams.get('offset'));
        }
      });
      // load
      this._load();
    });
    // subscribe to events
    this.subscription = this.eventService.register().subscribe((event) => {
      switch (event.type) {
        case EventType.library_updated:
          // reload all
          this._load();
          break;
        case EventType.item_updated:
          // refresh items
          this.refresh();
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
    // observerables
    forkJoin([this.narraLibraryService.getLibrary(this.params.get('id')), this.narraActionService.getActions()]).subscribe((responses) => {
      // get actions
      this.actions = responses[1].actions;
      // get library
      this.library = responses[0].library;
      // breadcrumbs;
      this.breadcrumbsService.updateLibrary(this.library.id, this.library.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.library, this.authService.user);
      // loading done
      this.loading = false;
    });
  }

  public _deleteItems(): void {
    // start refreshing
    this.refreshing = true;
    // close dialog
    this.delete = false;
    // clean library items
    this.narraLibraryService.deleteItems(this.library.id, this.selected.map((item) => item.id)).subscribe((response) => {
      // clean selected
      this.selected = [];
      // just reload
      timer(1042).subscribe(() => {
        this.refresh();
      });
    });
  }

  public refresh(state?: ClrDatagridStateInterface) {
    // start refreshing
    this.refreshing = true;
    // update pagination
    if (state) {
      // update from state
      this.pagination.page = state.page.current;
      this.pagination.perPage = state.page.size;
      // update breadcrumbs and query
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {page: this.pagination.page, perPage: this.pagination.perPage, offset: this.pagination.offset},
          queryParamsHandling: 'merge'
        });
      this.breadcrumbsService.updateLibrary(this.library.id, this.library.name, this.pagination);
    }
    // refresh
    this.narraLibraryService.getItems(this.library.id, undefined, this.pagination).subscribe((response) => {
      // get items
      this.items = response.items;
      this.pagination = response.pagination;
      // stop refreshing
      this.refreshing = false;
    });
  }

  public performAction(action): void {
    // perform action
    this.narraActionService.performAction(this.selected.map((item) => item.id), action).subscribe((response) => {
      // fire event
      this.eventService.broadcastEvent(EventType.action_performed);
      // get returns
      const returns = response.action.returns;
      // process them
      if (returns.length) {
        this._processReturns(returns, []);
      }
      // send message
      this.messageService.success('Action successfully executed');
    });
  }

  private _processReturns(returns: narra.Return[], files: string[]): void {
    // prepare objects
    const joins = [];
    // iterate over returns
    returns.forEach((r) => {
      // push into joins
      joins.push(this.narraReturnService.getReturn(r.id));
    });
    // check for the rest once requests done
    forkJoin<narra.Response<narra.Return, 'return'>>(joins).subscribe((responses) => {
      // process responses
      responses.forEach((responseee) => {
        const id = responseee.return.id;
        let url = responseee.return.url;
        // process those with url
        if (url != null) {
          // remove from returns
          returns = returns.filter((r) => r.id !== id);
          // check protocol
          // TODO better check
          if (this.narraServerService.apiServer.startsWith('https')) {
            url = url.replace('http', 'https')
          }
          // and into files
          files.push(url);
        }
      });
      // process when finished
      if (!returns.length) {
        // set wait flag to done and download files
        files.forEach((file) => {
          const parts = file.split('/');
          const filename = parts[parts.length - 1];
          saveAs(file, filename);
        });
        // send message
        this.messageService.success('Files successfully downloaded');
      } else {
        // continue
        setTimeout(() => {
          this._processReturns(returns, files);
        }, 1000);
      }
    });
  }

  public selectionChanged(items: narra.Item[]): void {
    // filter actions
    if (items.length) {
      // select uniq array of connectors
      const selection = Array.from(new Set(items.map((item) => item.connector)));
      // filter actions
      this.filteredActions = this.actions.filter((action) => {
        return [action.dependency, selection].reduce((a, b) => a.filter(c => b.includes(c))).length;
      });
    } else {
      this.filteredActions = [];
    }
    // assign selected items into array
    this.selected = items;
  }

  public getActions(): narra.Action[] {
    console.log('ted');
    // console.log();
    return this.actions;
  }
}
