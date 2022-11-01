/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClrWizard} from '@clr/angular';
import {Subscription} from 'rxjs';
import {AddService, AuthService, BreadcrumbService, EventService} from '@app/services';
import {EventType} from '@app/enums';
import {UntypedFormGroup} from '@angular/forms';
import {ScenarioHelper, UserHelper} from '@app/helpers';
import {narra} from '@narra/api';

@Component({
  selector: 'app-create-library-wizard',
  templateUrl: './create-library-wizard.component.html',
  styleUrls: ['./create-library-wizard.component.scss']
})
export class CreateLibraryWizardComponent implements OnInit, OnDestroy {
  @ViewChild('wizard') wizard: ClrWizard;
  @ViewChild('formBasic') formBasic: UntypedFormGroup;
  @ViewChild('formContributors') formContributors: UntypedFormGroup;

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
    private breadcrumbService: BreadcrumbService,
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
            if (this.breadcrumbService.project) {
              // get current project
              this.projectService.getProject(this.breadcrumbService.project).subscribe((responseee) => {
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
      stats: undefined,
      scenario: undefined,
      thumbnails: [],
      metadata: [],
      updated_at: undefined
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
