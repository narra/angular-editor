/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LibrariesNavigation} from '@app/navigation';
import {forkJoin, Observable} from 'rxjs';
import {RelationHelper, ScenarioHelper} from '@app/helpers';
import {AuthService, BreadcrumbService, EventService, MessageService} from '@app/services';
import {EventType, RelationType} from '@app/enums';
import cloneDeep from 'lodash/cloneDeep';
import {saveAs} from 'file-saver';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-libraries-settings',
  templateUrl: './libraries-settings.component.html',
  styleUrls: ['./libraries-settings.component.scss']
})
export class LibrariesSettingsComponent implements OnInit {
  @ViewChild('fileDropRef', {static: false}) fileDropEl: ElementRef;

  // public
  public navigation: Navigation;
  public loading: boolean;
  public library: narra.Library;
  public scenarios: narra.Scenario[];
  public changed: boolean;
  public clean: boolean;
  public delete: boolean;
  public files: any[] = [];
  public relation: RelationType;
  public RelationType = RelationType;

  // private
  private cache: narra.Library;
  private params: ParamMap;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private narraLibraryService: narra.LibraryService,
    private narraScenarioService: narra.ScenarioService,
    private narraProjectService: narra.ProjectService,
    private narraReturnService: narra.ReturnService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbsService: BreadcrumbService,
    private messageService: MessageService
  ) {
    this.loading = true;
    this.clean = false;
    this.delete = false;
    this.relation = RelationType.owned;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // get params
      this.params = params;
      // load navigation
      this.navigation = new LibrariesNavigation(params);
      // load
      this._load();
    });
  }

  private _load(): void {
    // process
    forkJoin([
      this.narraLibraryService.getLibrary(this.params.get('id')),
      this.narraScenarioService.getScenarios()
    ]).subscribe((responses) => {
      // get project
      this.library = responses[0].library;
      // get scenations
      this.scenarios = ScenarioHelper.filterInclude(responses[1].scenarios, narra.ScenarioType.library);
      // save to cache
      this.cache = cloneDeep(this.library);
      // breadcrumbs
      this.breadcrumbsService.updateLibrary(this.library.id, this.library.name);
      // relation
      this.relation = RelationHelper.getRelationship(this.library, this.authService.user);
      // loading done
      this.loading = false;
      // set changed flag
      this.changed = false;
    });
  }

  public _modelChanged(): void {
    this.changed = !(this.library.scenario.id === this.cache.scenario.id) || !(this.library.shared === this.cache.shared);
  }

  public _cleanLibrary() {
    // set loading flag
    this.loading = true;
    // close dialog
    this.clean = false;
    // clean library items
    this.narraLibraryService.cleanLibrary(this.library.id).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastLibraryEvent(this.library, EventType.library_cleaned);
      // reload data
      this._load();
    });
  }

  public _updateLibrary(): void {
    // set loading flag
    this.loading = true;
    // update project
    this.narraLibraryService.updateLibrary(this.library).subscribe((response) => {
      // broadcast event
      this.eventService.broadcastLibraryEvent(this.library, EventType.library_updated);
      // reload data
      this._load();
    });
  }

  public _deleteLibrary(): void {
    // set loading flag
    this.loading = true;
    // close dialog
    this.delete = false;
    // delete project
    this.narraLibraryService.deleteLibrary(this.library.id).subscribe((response) => {
      // redirect to dashboard
      if (response.id === this.library.id) {
        // broadcast event
        this.eventService.broadcastLibraryEvent(this.library, EventType.library_deleted);
        // redirect to project or libraries dashboard
        if (this.breadcrumbsService.project) {
          this.router.navigate(['projects', this.breadcrumbsService.project]);
        } else {
          this.router.navigate(['libraries']);
        }
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
      this.narraLibraryService.importLibrary(this.library.id, this.files[index]).subscribe((event: HttpEvent<any>) => {
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
              this.messageService.success('Library metadata import initiated.');
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

  public _exportLibrary(): void {
    // export project
    this.narraLibraryService.exportLibrary(this.library.id).subscribe((response) => {
      // process return
      this._processReturns([response.return], []);
      // send message
      this.messageService.success('Library metadata successfully exported');
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
