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

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClrWizard} from '@clr/angular';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {AddService, AuthService, EventService, MessageService} from '@app/services';
import {EventType} from '@app/enums';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import flattenDeep from 'lodash/flattenDeep';
import {FormGroup} from '@angular/forms';
import {ArrayHelper, ErrorHelper, RouterHelper, ScenarioHelper} from '@app/helpers';
import {Router} from '@angular/router';
import {narra} from '@narra/api';

@Component({
  selector: 'app-create-item-wizard',
  templateUrl: './create-item-wizard.component.html',
  styleUrls: ['./create-item-wizard.component.scss']
})
export class CreateItemWizardComponent extends ErrorHelper implements OnInit, OnDestroy {
  @ViewChild('wizard') wizard: ClrWizard;
  @ViewChild('formLibrary') formLibrary: FormGroup;
  @ViewChild('fileDropRef', {static: false}) fileDropEl: ElementRef;

  // private
  private subscription: Subscription;

  // public
  public open: boolean;
  public addingFlag: boolean;
  public addingProgress: number;
  public addingMax: number;
  public loadingFlag: boolean;
  public readyFlag: boolean;
  public errorFlag: boolean;
  public validationFlag: boolean;
  public selectionActive: boolean;
  public creationActive: boolean;
  public selectedLibrary: string;
  public project: narra.Project;
  public newLibrary: narra.Library;
  public libraries: narra.Library[];
  public scenarios: narra.Scenario[];
  public proxies: narra.Proxy[] = [];
  public files: any[] = [];

  constructor(
    private addService: AddService,
    private authService: AuthService,
    private uploadService: narra.UploadService,
    private itemService: narra.ItemService,
    private libraryService: narra.LibraryService,
    private scenarioService: narra.ScenarioService,
    private projectService: narra.ProjectService,
    private eventService: EventService,
    private messageService: MessageService,
    private router: Router) {
    super(messageService);
    this.open = false;
    this.loadingFlag = true;
    this.addingFlag = false;
    this.readyFlag = false;
    this.errorFlag = false;
    this.validationFlag = false;
    this.selectionActive = true;
    this.creationActive = false;
    this.newLibrary = this.emptyLibrary();
  }

  ngOnInit(): void {
    this.subscription = this.addService.register().subscribe((event) => {
      if (event.type === EventType.create_item) {
        // clear
        this._clear();
        // get router segments
        const segments = RouterHelper.resolveCurrentRouteSegments(this.router);
        // open dialog
        this.open = true;
        // check the scope
        if (segments.length && segments[0] === 'libraries' && segments[1]) {
          // get current library
          this.libraryService.getLibrary(segments[1]).subscribe((response) => {
            this.selectedLibrary = response.library.id;
          });
        }
        // load scenarios
        this.scenarioService.getScenarios().subscribe((response) => {
          // store scenarios
          this.scenarios = ScenarioHelper.filterInclude(response.scenarios, narra.ScenarioType.library);
          // assign default one
          if (this.scenarios.length) {
            this.newLibrary.scenario = this.scenarios[0];
          }
          // check the scope
          if (segments.length && segments[0] === 'projects' && segments[1]) {
            // get current project
            this.projectService.getProject(segments[1]).subscribe((responsee) => {
              this.project = responsee.project;
              // loading done
              this.loadingFlag = false;
            });
          } else {
            // loading done
            this.loadingFlag = false;
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _clear(): void {
    // reset wizard
    this.wizard.reset();
    // reset forms
    this.formLibrary.reset();
    // reset file upload
    this.files = [];
    this.proxies = [];
    this.selectedLibrary = undefined;
    this.newLibrary = this.emptyLibrary();
    // reset adding
    this.addingFlag = false;
    this.addingProgress = 0;
    this.addingMax = 1;
  }

  public emptyLibrary(): narra.Library {
    // create empty project
    const empty: narra.Library = {
      id: undefined,
      name: '',
      description: '',
      author: this.authService.user,
      shared: false,
      purged: false,
      contributors: [],
      scenario: undefined,
      thumbnails: [],
      metadata: []
    };
    // return
    return empty;
  }

  public doCancel(): void {
    // close wizard
    this.wizard.close();
    // clear
    this._clear();
  }

  public doPrevious(): void {
    this.wizard.previous();
  }

  public isUploaded(): boolean {
    return this.files.find((file) => file.success);
  }

  public isChecked(): boolean {
    return this.proxies.length > 0 && ArrayHelper.pluck(this.proxies, 'selected').reduce((result, proxy) => {
      return result || proxy;
    });
  }

  public prepareOptions(): void {
    // loading on
    this.loadingFlag = true;
    // load libraries
    this.libraryService.getLibraries().subscribe((response) => {
      // set libraries
      this.libraries = response.libraries;
      // move next
      this.wizard.next();
      // loading done
      this.loadingFlag = false;
      // filter proxies with library support
      const resolvedLibraries = this.proxies.filter((proxy) => 'library' in proxy.options).map( (proxy) => proxy.options['library']);
      // select library or set name
      if (resolvedLibraries.length) {
        const filtered = this.libraries.filter((library) => library.name === resolvedLibraries[0]);
        if (filtered.length) {
          this.selectedLibrary = filtered[0].id;
          this.selectionActive = true;
          this.creationActive = false;
        } else {
          this.newLibrary.name = resolvedLibraries[0];
          this.selectionActive = false;
          this.creationActive = true;
        }
      }
    });
  }

  /**
   * on file drop handler
   */
  public onFileDropped($event): void {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  public fileBrowseHandler(files): void {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  public removeFile(index: number): void {
    this.files.splice(index, 1);
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
      this.uploadService.upload(this.files[index]).subscribe((event: HttpEvent<any>) => {
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
            if (event.body.ingest) {
              this.files[index].success = true;
              this.files[index].ingest = event.body.ingest;
            } else {
              this.files[index].error = true;
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
    this.uploadFile();
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  public formatBytes(bytes, decimals = 2): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public checkFiles(): void {
    // loading on
    this.loadingFlag = true;
    // prepare ingests
    forkJoin(this.files.filter((file) => file.ingest).map<Observable<narra.Response<narra.Proxy[], 'proxies'>>>((file) => {
      return this.itemService.check(file.ingest.url);
    })).subscribe((responses) => {
      // fill candidates
      this.proxies = flattenDeep(responses.map((response) => response.proxies));
      // select all proxies
      this.selectProxies(true);
      // move next
      this.wizard.next();
      // loading done
      this.loadingFlag = false;
    });
  }

  public selectProxies(select: boolean): void {
    this.proxies.forEach((proxy) => {
      proxy.selected = select;
    });
  }

  public onFinish(): void {
    if (this.creationActive) {
      this.libraryService.addLibrary(this.newLibrary).subscribe((response) => {
        // broadcast event
        this.eventService.broadcastLibraryEvent(response.library, EventType.library_created);
        // update project if necessary
        if (this.project) {
          // push new library into project
          this.project.libraries.push(response.library);
          // update
          this.projectService.updateProject(this.project).subscribe((responsee) => {
            // project changed
            this.eventService.broadcastProjectEvent(responsee.project, EventType.project_updated);
            // add items
            this.addItems(response.library.id);
          });
        } else {
          // add items
          this.addItems(response.library.id);
        }
      });
    } else {
      this.addItems(this.selectedLibrary);
    }
  }

  public addItems(library: string): void {
    // set loading flag
    this.loadingFlag = true;
    // set adding flag
    this.addingFlag = true;
    // chunk proxies
    const chunks = ArrayHelper.chunk(this.proxies.filter((proxy) => proxy.selected).map((proxy) => {
      return {library, proxy};
    }), 50);
    // update progress max
    this.addingMax = chunks.length;
    // execute actions
    const observerables: Observable<narra.Response<string[], 'ids'>>[] = chunks.map((chunk) => {
      return this.itemService.addItems(chunk);
    });
    // update progress
    observerables.forEach((observerable) => {
      observerable.subscribe((response) => {
        // add progress
        this.addingProgress += 1;
        // check for errors
        this.handleError(response.errors);
      });
    });
    forkJoin(observerables).subscribe((results) => {
      // broadcast events
      this.eventService.broadcastEvents([EventType.item_created, EventType.library_updated]);
      // close wizard
      this.wizard.finish();
    });
  }
}
