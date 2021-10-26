/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';
import {EventType, RelationType} from '@app/enums';
import {RelationHelper} from '@app/helpers';
import {AddService, AuthService, BreadcrumbService, EventService} from '@app/services';
import {ProjectsNavigation} from '@app/navigation';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-projects-metadata',
  templateUrl: './projects-metadata.component.html',
  styleUrls: ['./projects-metadata.component.scss']
})
export class ProjectsMetadataComponent implements OnInit, OnDestroy {
  @ViewChild('formAdd') formAdd: FormGroup;

  // public
  public navigation: Navigation;
  public loading: boolean;
  public project: narra.Project;
  public params: ParamMap;
  public relation: RelationType;
  public openAddDialog: boolean;
  public newMeta: Pick<narra.Meta, 'name' | 'value'>;
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
      // clean new meta fields
      this.newMeta = this.emptyMetadata();
      // reset form
      this.formAdd.reset();
      // loading done
      this.loading = false;
    });
  }

  public emptyMetadata(): Pick<narra.Meta, 'name' | 'value'> {
    // create empty project
    return {
      name: '',
      value: ''
    };
  }

  public _updateMeta(meta: narra.Meta): void {
    // set loading flag
    this.loading = true;
    // update project
    this.projectService.updateProjectMeta(this.project.id, meta).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastProjectEvent(this.project, EventType.project_updated);
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
    this.projectService.addProjectMeta(this.project.id, this.newMeta).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastProjectEvent(this.project, EventType.project_updated);
      // reload data
      this._load();
    });
  }

  public _deleteMeta(meta: narra.Meta): void {
    // set loading flag
    this.loading = true;
    // update project
    this.projectService.deleteProjectMeta(this.project.id, meta).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastProjectEvent(this.project, EventType.project_updated);
      // reload data
      this._load();
    });
  }
}
