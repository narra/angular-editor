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

import {Injectable} from '@angular/core';
import {Breadcrumb, Event, Publisher} from '@app/models';
import {EventType} from '@app/enums';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService extends Publisher<Breadcrumb> {
  private breadcrumb: Breadcrumb;

  constructor() {
    // initialize publisher
    super();
    // initialization
    // get link from local storage
    const link = localStorage.getItem('link');
    // update breadcrumb if exists
    if (link) {
      // store
      this.breadcrumb = this.decode(link);
      // update
      this._update();
    } else {
      // generate empty breadcrumb
      this.empty();
    }
  }

  public empty(): void {
    this.breadcrumb = {project: undefined, library: undefined, item: undefined};
    // update
    this._update();
  }

  public updateProject(name: string, title: string): void {
    // update project
    this.breadcrumb.project = {name, title};
    // clean library
    this.breadcrumb.library = undefined;
    // update
    this._update();
  }

  public updateLibrary(id: string, name: string): void {
    // update project
    this.breadcrumb.library = {id, name};
    // clean item
    this.breadcrumb.item = undefined;
    // update
    this._update();
  }

  public updateItem(id: string, name: string): void {
    // update project
    this.breadcrumb.item = {id, name};
    // update
    this._update();
  }

  public get project(): string {
    // return project name if project exists
    if (this.breadcrumb.project) {
      return this.breadcrumb.project.name;
    }
    // default
    return undefined;
  }

  public decode(link: string): Breadcrumb {
    return JSON.parse(decodeURI(this.b64DecodeUnicode(atob(link))));
  }

  private _update(): void {
    // save into local storage
    localStorage.setItem('link', btoa(this.b64EncodeUnicode(JSON.stringify(this.breadcrumb))));
    // broadcast
    this.broadcast(Event.complex<Breadcrumb>(EventType.navigation_changed, this.breadcrumb));
  }

  private b64EncodeUnicode(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(('0x' + p1) as any);
    }));
  }

  private b64DecodeUnicode(str: string): string {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
