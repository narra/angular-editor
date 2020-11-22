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
