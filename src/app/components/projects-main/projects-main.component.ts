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
      this.breadcrumbsService.updateProject(this.project.name, this.project.title);
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
