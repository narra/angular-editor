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

import {NavigationElement} from '@app/models/navigation-element';

export abstract class Navigation {
  protected elements: NavigationElement[];

  constructor() {
    this.elements = [];
  }

  public getElements(): NavigationElement[] {
    return this.elements;
  }

  public addElement(element: NavigationElement): void {
    this.elements.push(element);
  }

  public addElements(elements: NavigationElement[]): void {
    elements.forEach(element => {
      this.addElement(element);
    });
  }

  public get provider(): Navigation {
    return this;
  }
}


