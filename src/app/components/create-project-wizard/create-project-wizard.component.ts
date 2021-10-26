/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
      id: '',
      name: '',
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
    this.project.id = this.project.name.replace(/ +/gi, '_').toLowerCase();
    // validation
    this.projectService.validate(this.project.id, this.project.name).subscribe(validation => {
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
