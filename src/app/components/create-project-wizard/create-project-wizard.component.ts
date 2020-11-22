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
import {AddService, AuthService, EventService, MessageService} from '@app/services';
import {EventType} from '@app/enums';
import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ScenarioHelper, UserHelper} from '@app/helpers';
import {narra} from '@narra/api';

@Component({
  selector: 'app-create-project-wizard',
  templateUrl: './create-project-wizard.component.html',
  styleUrls: ['./create-project-wizard.component.scss']
})
export class CreateProjectWizardComponent implements OnInit, OnDestroy {
  @ViewChild('wizard') wizard: ClrWizard;
  @ViewChild('formBasic') formBasic: FormGroup;
  @ViewChild('formContributors') formContributors: FormGroup;

  // public
  public open: boolean;
  public project: narra.Project;
  public users: narra.User[];
  public scenarios: narra.Scenario[];
  public loadingFlag: boolean;
  public errorFlag: boolean;

  // private
  private subscription: Subscription;

  constructor(
    private addService: AddService,
    private authService: AuthService,
    private eventService: EventService,
    private messagesService: MessageService,
    private userService: narra.UserService,
    private projectService: narra.ProjectService,
    private scenarioService: narra.ScenarioService) {
    this.open = false;
    this.project = this.emptyProject();
    this.loadingFlag = true;
    this.errorFlag = false;
  }

  ngOnInit(): void {
    this.subscription = this.addService.register().subscribe(event => {
      if (event.type === EventType.create_project) {
        // reset default model
        this.project = this.emptyProject();
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
            this.scenarios = ScenarioHelper.filterInclude(responsee.scenarios, narra.ScenarioType.project);
            // assign default one
            if (this.scenarios.length) {
              this.project.scenario = this.scenarios[0];
            }
            // loading done
            this.loadingFlag = false;
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public emptyProject(): narra.Project {
    // create empty project
    return {
      name: '',
      title: '',
      description: '',
      author: this.authService.user,
      scenario: undefined,
      contributors: [],
      metadata: [],
      thumbnails: [],
      public: false,
      libraries: []
    };
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
    // convert title for name
    this.project.name = this.project.title.replace(/ +/gi, '_').toLowerCase();
    // validation
    this.projectService.validate(this.project.name, this.project.title).subscribe(validation => {
      if (validation) {
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
    this.projectService.addProject(this.project).subscribe((response) => {
      // broadcast
      this.eventService.broadcastProjectEvent(response.project, EventType.project_created);
      // close wizard
      this.wizard.finish();
    });
  }
}
