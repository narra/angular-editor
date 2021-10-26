/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AddService, AuthService, BreadcrumbService, EventService, UserPreferencesService} from '@app/services';
import {EventType, RelationType, UserPreferencesType, WizardType} from '@app/enums';
import {Subscription} from 'rxjs';
import {narra} from '@narra/api';
import {ArrayHelper, RelationHelper, UserHelper} from '@app/helpers';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit, OnDestroy {

  // public
  public loading: boolean;
  public projects: narra.Project[];
  public WizardType = WizardType;
  public RelationType = RelationType;
  public RelationHelper = RelationHelper;

  // private
  private subscription: Subscription;

  constructor(
    private projectService: narra.ProjectService,
    private authService: AuthService,
    private addService: AddService,
    private eventService: EventService,
    private userPreferencesService: UserPreferencesService,
    private breadcrumbsService: BreadcrumbService
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
    // subscribe for events
    this.subscription = this.eventService.register().subscribe(event => {
      // check event
      if (event.type === EventType.project_created ||
        (event.type === EventType.user_preferences_updated && event.content === UserPreferencesType.superuser)) {
        // reload
        this._load();
      }
    });
    // load data
    this._load();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _load(): void {
    // reset load flag
    this.loading = true;
    // load projects
    this.projectService.getProjects().subscribe((response) => {
      // filter projects
      if (UserHelper.isAdmin(this.authService.user) && this.userPreferencesService.superuser) {
        this.projects = response.projects;
      } else {
        this.projects = ArrayHelper.filterIncludeAuthors<narra.Project>(response.projects, [this.authService.user]);
      }
      // breadcrumbs
      this.breadcrumbsService.empty();
      // stop loading
      this.loading = false;
    });
  }
}
