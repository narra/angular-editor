/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Navigation} from '@app/models';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ProjectsNavigation} from '@app/navigation';
import {forkJoin} from 'rxjs';
import {RelationHelper, ScenarioHelper} from '@app/helpers';
import {narra} from '@narra/api';
import {AuthService, BreadcrumbService, EventService, MessageService} from '@app/services';
import {EventType, RelationType} from '@app/enums';
import cloneDeep from 'lodash/cloneDeep';
import {saveAs} from 'file-saver';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-projects-settings',
  templateUrl: './projects-settings.component.html',
  styleUrls: ['./projects-settings.component.scss']
})
export class ProjectsSettingsComponent implements OnInit {
  @ViewChild('fileDropRef', {static: false}) fileDropEl: ElementRef;

  // public
  public navigation: Navigation;
  public loading: boolean;
  public project: narra.Project;
  public scenarios: narra.Scenario[];
  public changed: boolean;
  public delete: boolean;
  public files: any[] = [];
  public relation: RelationType;
  public RelationType = RelationType;

  // private
  private cache: narra.Project;
  private params: ParamMap;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private narraProjectService: narra.ProjectService,
    private narraScenarioService: narra.ScenarioService,
    private narraReturnService: narra.ReturnService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbsService: BreadcrumbService,
    private messageService: MessageService
  ) {
    this.loading = true;
    this.delete = false;
    this.relation = RelationType.owned;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // get params
      this.params = params;
      // load navigation
      this.navigation = new ProjectsNavigation(params);
      // load
      this._load();
    });
  }

  private _load(): void {
    forkJoin([
      this.narraProjectService.getProject(this.params.get('name')),
      this.narraScenarioService.getScenarios()
    ]).subscribe(results => {
      // get project
      this.project = results[0].project;
      // get scenations
      this.scenarios = ScenarioHelper.filterInclude(results[1].scenarios, narra.ScenarioType.project);
      // save to cache
      this.cache = cloneDeep(this.project);
      // breadcrumbs
      this.breadcrumbsService.updateProject(this.project.id, this.project.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.project, this.authService.user);
      // loading done
      this.loading = false;
      // set changed flag
      this.changed = false;
    });
  }

  public _modelChanged() {
    this.changed = !(this.project.scenario.id === this.cache.scenario.id) || !(this.project.public === this.cache.public);
  }

  public _updateProject() {
    // set loading flag
    this.loading = true;
    // update project
    this.narraProjectService.updateProject(this.project).subscribe(project => {
      // broadcast event
      this.eventService.broadcastProjectEvent(this.project, EventType.project_updated);
      // reload data
      this._load();
    });
  }

  public _deleteProject() {
    // set loading flag
    this.loading = true;
    // close dialog
    this.delete = false;
    // delete project
    this.narraProjectService.deleteProject(this.project.id).subscribe((response) => {
      // redirect to dashboard
      if (response.id === this.project.id) {
        // broadcast event
        this.eventService.broadcastProjectEvent(this.project, EventType.project_deleted);
        // redirect
        this.router.navigate(['projects']);
      }
    });
  }

  /**
   * handle file from browsing
   */
  public fileBrowseHandler(files): void {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  private prepareFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      item.error = false;
      item.success = false;
      if (!this.files.find((file) => file.name === item.name)) {
        this.files.push(item);
      }
    }
    this.fileDropEl.nativeElement.value = '';
    this.uploadFile(0, true);
  }

  public uploadFile(index: number = 0, single: boolean = false, ignore: boolean = true): void {
    // we're at the end
    if (index === this.files.length) {
      return;
    }
    // skipping finished ones and error if ignored
    if (!this.files[index].success && !(ignore && this.files[index].error) && !this.files[index].uploading) {
      // push uploading flag
      this.files[index].uploading = true;
      // upload
      this.narraProjectService.importProject(this.project.id, this.files[index]).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.files[index].progress = 0;
            this.files[index].error = false;
            this.files[index].success = false;
            break;
          case HttpEventType.UploadProgress:
            this.files[index].progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            if (event.body.event) {
              this.files[index].success = true;
              this.files[index].event = event.body.event;
              // fire message
              this.messageService.success('Project\'s metadata import initiated.');
            } else {
              this.files[index].error = true;
              // check for errors messages
              if (event.body.errors) {
                event.body.errors.forEach((error) => {
                  this.messageService.error(error.message, error.trace);
                });
              }
            }
            // clean uploading flag
            this.files[index].uploading = false;
            // move on if wanted
            if (!single) {
              this.uploadFile(index + 1);
            }
        }
      });
    }
    // if not single next
    if (!single) {
      this.uploadFile(index + 1);
    }
  }

  public _exportProject(): void {
    // export project
    this.narraProjectService.exportProject(this.project.id).subscribe((response) => {
      // process return
      this._processReturns([response.return], []);
      // send message
      this.messageService.success('Project\'s metadata successfully exported');
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
        const url = responseee.return.url;
        // process those with url
        if (url != null) {
          // remove from returns
          returns = returns.filter((r) => r.id !== id);
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
}
