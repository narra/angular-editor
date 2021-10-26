/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Navigation, Publisher} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ProjectsNavigation} from '@app/navigation';
import {EventType, RelationType, WizardType} from '@app/enums';
import {RelationHelper} from '@app/helpers';
import {AddService, AuthService, BreadcrumbService, EventService} from '@app/services';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-projects-main',
  templateUrl: './projects-main.component.html',
  styleUrls: ['./projects-main.component.scss']
})
export class ProjectsMainComponent implements OnInit, OnDestroy {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public project: narra.Project;
  public params: ParamMap;
  public relation: RelationType;
  public pagination: narra.Pagination;
  public edit: boolean;
  public RelationType = RelationType;
  public RelationHelper = RelationHelper;

  // private
  private subscription: Subscription;

  constructor(
    private projectService: narra.ProjectService,
    private authService: AuthService,
    private addService: AddService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
    this.relation = RelationType.owned;
    this.pagination = {page: 1, perPage: 50, offset: 0} as narra.Pagination;
  }

  ngOnInit(): void {
    // get params
    this.route.paramMap.subscribe(params => {
      // get params
      this.params = params;
      // load navigation
      this.navigation = new ProjectsNavigation(params);
      // load
      this._load();
    });
    // subscribe to events
    this.subscription = this.eventService.register().subscribe(event => {
      // check event type
      if (event.type === EventType.project_updated) {
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
    this.projectService.getProject(this.params.get('name')).subscribe((response) => {
      // get project
      this.project = response.project;
      // breadcrumbs
      this.breadcrumbsService.updateProject(this.project.id, this.project.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.project, this.authService.user);
      // loading done
      this.loading = false;
    });
  }

  public _removeLibrary(library: narra.Library): void {
    // set loading flag
    this.loading = true;
    // update libraries
    this.project.libraries = this.project.libraries.filter(item => {
      return item.id !== library.id;
    });
    // update project
    this.projectService.updateProject(this.project).subscribe((response) => {
      // broadcast
      this.eventService.broadcastProjectEvent(response.project, EventType.project_updated);
    });
  }
}
