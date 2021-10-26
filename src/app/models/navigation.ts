/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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


