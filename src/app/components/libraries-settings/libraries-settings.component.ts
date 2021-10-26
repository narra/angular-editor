/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, OnInit} from '@angular/core';
import {Navigation} from '@app/models';
import {narra} from '@narra/api';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {LibrariesNavigation} from '@app/navigation';
import {forkJoin, Observable} from 'rxjs';
import {RelationHelper, ScenarioHelper} from '@app/helpers';
import {AuthService, BreadcrumbService, EventService} from '@app/services';
import {EventType, RelationType} from '@app/enums';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-libraries-settings',
  templateUrl: './libraries-settings.component.html',
  styleUrls: ['./libraries-settings.component.scss']
})
export class LibrariesSettingsComponent implements OnInit {

  // public
  public navigation: Navigation;
  public loading: boolean;
  public library: narra.Library;
  public scenarios: narra.Scenario[];
  public changed: boolean;
  public clean: boolean;
  public delete: boolean;
  public relation: RelationType;
  public RelationType = RelationType;

  // private
  private cache: narra.Library;
  private params: ParamMap;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private libraryService: narra.LibraryService,
    private scenarioService: narra.ScenarioService,
    private projectService: narra.ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbsService: BreadcrumbService
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
      this.libraryService.getLibrary(this.params.get('id')),
      this.scenarioService.getScenarios()
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
    this.libraryService.cleanLibrary(this.library.id).subscribe((response) => {
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
    this.libraryService.updateLibrary(this.library).subscribe((response) => {
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
    this.libraryService.deleteLibrary(this.library.id).subscribe((response) => {
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
}
