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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClrWizard} from '@clr/angular';
import {Subscription} from 'rxjs';
import {AddService, AuthService, EventService} from '@app/services';
import {EventType} from '@app/enums';
import {FormGroup} from '@angular/forms';
import {RouterHelper, ScenarioHelper, UserHelper} from '@app/helpers';
import {Router} from '@angular/router';
import {narra} from '@narra/api';

@Component({
  selector: 'app-create-library-wizard',
  templateUrl: './create-library-wizard.component.html',
  styleUrls: ['./create-library-wizard.component.scss']
})
export class CreateLibraryWizardComponent implements OnInit, OnDestroy {
  @ViewChild('wizard') wizard: ClrWizard;
  @ViewChild('formBasic') formBasic: FormGroup;
  @ViewChild('formContributors') formContributors: FormGroup;

  // public
  public open: boolean;
  public library: narra.Library;
  public users: narra.User[];
  public scenarios: narra.Scenario[];
  public project: narra.Project;
  public loadingFlag: boolean;
  public errorFlag: boolean;

  // private
  private subscription: Subscription;

  constructor(
    private addService: AddService,
    private authService: AuthService,
    private eventService: EventService,
    private userService: narra.UserService,
    private scenarioService: narra.ScenarioService,
    private libraryService: narra.LibraryService,
    private projectService: narra.ProjectService,
    private router: Router
  ) {
    this.open = false;
    this.library = this.emptyLibrary();
    this.loadingFlag = true;
    this.errorFlag = false;
  }

  ngOnInit(): void {
    this.subscription = this.addService.register().subscribe(event => {
      if (event.type === EventType.create_library) {
        // reset default model
        this.library = this.emptyLibrary();
        // reset project
        this.project = undefined;
        // get router segments
        const segments = RouterHelper.resolveCurrentRouteSegments(this.router);
        // reset forms
        this.formBasic.reset();
        this.formContributors.reset();
        // reset wizard
        this.wizard.reset();
        // open dialog
        this.open = true;
        // load navigation needed for wizard
        this.userService.getUsers().subscribe((response) => {
          // store users
          this.users = UserHelper.filterExclude(response.users, [this.authService.user]);
          // load scenarios
          this.scenarioService.getScenarios().subscribe((responsee) => {
            // store scenarios
            this.scenarios = ScenarioHelper.filterInclude(responsee.scenarios, narra.ScenarioType.library);
            // assign default one
            if (this.scenarios.length) {
              this.library.scenario = this.scenarios[0];
            }
            // check the scope
            if (segments.length && segments[0] === 'projects' && segments[1]) {
              // get current project
              this.projectService.getProject(segments[1]).subscribe((responseee) => {
                this.project = responseee.project;
                // loading done
                this.loadingFlag = false;
              });
            } else {
              // loading done
              this.loadingFlag = false;
            }
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.wizard.close();
  }

  public doPrevious(): void {
    this.wizard.previous();
  }

  public onCommit(): void {
    // set flags
    this.loadingFlag = true;
    this.errorFlag = false;
    // validation
    this.libraryService.validate(this.library.name).subscribe((response) => {
      if (response.validation) {
        this.wizard.forceNext();
      } else {
        this.errorFlag = true;
      }
      this.loadingFlag = false;
    });
  }

  public onFinish(): void {
    // set loading flag
    this.loadingFlag = true;
    // add project
    this.libraryService.addLibrary(this.library).subscribe((response) => {
      // broadcast
      this.eventService.broadcastLibraryEvent(response.library, EventType.library_created);
      // update project if necessary
      if (this.project) {
        // push new library into project
        this.project.libraries.push(response.library);
        // update
        this.projectService.updateProject(this.project).subscribe((responsee) => {
          // project changed
          this.eventService.broadcastProjectEvent(responsee.project, EventType.project_updated);
          // close wizard
          this.wizard.finish();
        });
      } else {
        // close wizard
        this.wizard.finish();
      }
    });
  }
}
