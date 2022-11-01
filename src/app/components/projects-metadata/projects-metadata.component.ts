/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {EventType, RelationType} from '@app/enums';
import {RelationHelper} from '@app/helpers';
import {AddService, AuthService, BreadcrumbService, EventService, MessageService} from '@app/services';
import {ProjectsNavigation} from '@app/navigation';
import {UntypedFormGroup} from '@angular/forms';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-projects-metadata',
  templateUrl: './projects-metadata.component.html',
  styleUrls: ['./projects-metadata.component.scss']
})
export class ProjectsMetadataComponent implements OnInit, OnDestroy {
  @ViewChild('formAdd') formAdd: UntypedFormGroup;
  @ViewChild('formCopy') formCopy: UntypedFormGroup;
  @ViewChild('fileDropRef', {static: false}) fileDropEl: ElementRef;

  // public
  public navigation: Navigation;
  public loading: boolean;
  public project: narra.Project;
  public destination: narra.Project;
  public projects: narra.Project[];
  public params: ParamMap;
  public relation: RelationType;
  public openAddDialog: boolean;
  public openCopyDialog: boolean;
  public newMeta: Pick<narra.Meta, 'name' | 'value'>;
  public files: any[] = [];
  public RelationType = RelationType;
  public RelationHelper = RelationHelper;

  // private
  private subscription: Subscription;

  constructor(
    private narraProjectService: narra.ProjectService,
    private narraReturnService: narra.ReturnService,
    private authService: AuthService,
    private addService: AddService,
    private eventService: EventService,
    private route: ActivatedRoute,
    private breadcrumbsService: BreadcrumbService,
    private messageService: MessageService
  ) {
    this.loading = true;
    this.openAddDialog = false;
    this.openCopyDialog = false;
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
    // prepare objects
    const joins = [this.narraProjectService.getProject(this.params.get('name')), this.narraProjectService.getProjects()];
    // process
    forkJoin<any>(joins).subscribe((responses) => {
      // process libraries
      this.projects = (responses[1] as narra.Response<narra.Project[], 'projects'>).projects.filter((project) => project.id !== this.params.get('name'));
      // select destination
      if (this.projects.length) {
        this.destination = this.projects[0];
      }
      // get project
      this.project = (responses[0] as narra.Response<narra.Project, 'project'>).project;
      // breadcrumbs
      this.breadcrumbsService.updateProject(this.project.id, this.project.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.project, this.authService.user);
      // clean new meta fields
      this.newMeta = this.emptyMetadata();
      // reset form
      this.formAdd.reset();
      // clean files
      this.files = [];
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
    this.narraProjectService.updateProjectMeta(this.project.id, meta).subscribe((response) => {
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
    this.narraProjectService.addProjectMeta(this.project.id, this.newMeta).subscribe((response) => {
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
    this.narraProjectService.deleteProjectMeta(this.project.id, meta).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastProjectEvent(this.project, EventType.project_updated);
      // reload data
      this._load();
    });
  }

  public _exportMeta(): void {
    // export project
    this.narraProjectService.exportProject(this.project.id).subscribe((response) => {
      // process return
      this._processReturns([response.return], []);
      // send message
      this.messageService.success('Project\'s metadata successfully exported');
    });
  }

  public _copyMeta(): void {
    // copy library
    this.narraProjectService.copyProject(this.project.id, this.destination.id).subscribe((response) => {
      // send message
      this.messageService.success('Project metadata copy process successfully initiated');
      // close dialog
      this.openCopyDialog = false;
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
      // set loading flag
      this.loading = true;
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
              // wait and reload page
              setTimeout(() => {
                this._load();
              }, 2000);
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

  private _processReturns(returns: narra.Return[], files: string[]): void {
    // prepare objects
    const joins: Observable<narra.Response<narra.Return, 'return'>>[] = [];
    // iterate over returns
    returns.forEach((r) => {
      // push into joins
      joins.push(this.narraReturnService.getReturn(r.id));
    });
    // check for the rest once requests done
    forkJoin(joins).subscribe((responses) => {
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
