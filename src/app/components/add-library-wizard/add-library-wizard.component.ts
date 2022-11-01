/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClrWizard} from '@clr/angular';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {narra} from '@narra/api';
import {AddService, AuthService, EventService} from '@app/services';
import {Router} from '@angular/router';
import {EventType} from '@app/enums';
import {ArrayHelper, RouterHelper} from '@app/helpers';

@Component({
  selector: 'app-add-library-wizard',
  templateUrl: './add-library-wizard.component.html',
  styleUrls: ['./add-library-wizard.component.scss']
})
export class AddLibraryWizardComponent implements OnInit, OnDestroy {
  @ViewChild('wizard') wizard: ClrWizard;

  // public
  public open: boolean;
  public project: narra.Project;
  public libraries: narra.Library[];
  public loadingFlag: boolean;
  public errorFlag: boolean;
  public selection: number;

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
    this.loadingFlag = true;
    this.errorFlag = false;
    this.libraries = [];
    this.selection = 0;
  }

  ngOnInit(): void {
    this.subscription = this.addService.register().subscribe((event) => {
      // check event type
      if (event.type === EventType.add_library) {
        // clear
        this._clear();
        // set loading
        this.loadingFlag = true;
        // get router segments
        const segments = RouterHelper.resolveCurrentRouteSegments(this.router);
        // check the scope
        if (segments.length && segments[0] === 'projects' && segments[1]) {
          // reset wizard
          this.wizard.reset();
          // open dialog
          this.open = true;
          // process
          forkJoin([
            this.projectService.getProject(segments[1]),
            this.libraryService.getLibraries()]).subscribe((responses) => {
            // get project
            this.project = responses[0].project;
            // filter cache
            const cache = ArrayHelper.pluck(this.project.libraries, 'id');
            // get libraries and filter
            this.libraries = responses[1].libraries.filter(library => {
              return !cache.includes(library.id);
            });
            // sort libraries
            this.libraries = ArrayHelper.sort('name', this.libraries);
            // loading done
            this.loadingFlag = false;
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _clear(): void {
    // reset wizard
    this.wizard.reset();
    // reset file upload
    this.selection = 0;
    this.project = undefined;
  }

  public doCancel(): void {
    // close wizard
    this.wizard.close();
    // clear
    this._clear();
  }

  public onFinish(): void {
    // set loading flag
    this.loadingFlag = true;
    // save project
    this.projectService.updateProject(this.project).subscribe(response => {
      // broadcast
      this.eventService.broadcastProjectEvent(response.project, EventType.project_updated);
      // close wizard
      this.wizard.finish();
    });
  }

  public select(library: narra.Library, index: number = -1): number {
    // select or deselect
    if (index === -1) {
      // selection
      this.selection++;
      // push and get back index
      return this.project.libraries.push(library);
    } else {
      // slice
      this.project.libraries.slice(index, 1);
      // remove selection
      this.selection--;
      // clear index
      return undefined;
    }
  }
}
