/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Component, Input, OnInit} from '@angular/core';
import {AddService} from '@app/services';
import {WizardType} from '@app/enums';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent implements OnInit {
  @Input('wizard') type: WizardType;

  constructor(private addService: AddService) {
  }

  ngOnInit() {}

  public add(): void {
    switch (this.type) {
      case WizardType.create_project:
        this.addService.createProject();
        break;
      case WizardType.create_library:
        this.addService.createLibrary();
        break;
      case WizardType.create_scenario:
        this.addService.createScenario();
        break;
      case WizardType.create_item:
        this.addService.createItem();
        break;
    }
  }
}
