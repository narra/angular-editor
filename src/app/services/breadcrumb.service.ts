/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Injectable} from '@angular/core';
import {Breadcrumb, BreadcrumbElement, Event, Publisher} from '@app/models';
import {EventType} from '@app/enums';
import {narra} from '@narra/api';

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
    this.breadcrumb = new Breadcrumb();
    // update
    this._update();
  }

  public updateProject(id: string, name: string): void {
    // update project
    this.breadcrumb.project = {id, name} as BreadcrumbElement;
    // clean library
    this.breadcrumb.library = undefined;
    // update
    this._update();
  }

  public updateLibrary(id: string, name: string, pagination?: narra.Pagination): void {
    // update project
    this.breadcrumb.library = {id, name, pagination} as BreadcrumbElement;
    // clean item
    this.breadcrumb.item = undefined;
    // update
    this._update();
  }

  public updateItem(id: string, name: string): void {
    // update project
    this.breadcrumb.item = {id, name} as BreadcrumbElement;
    // update
    this._update();
  }

  public get project(): string {
    // return project id if project exists
    if (this.breadcrumb.project) {
      return this.breadcrumb.project.id;
    }
    // default
    return undefined;
  }

  public get library(): string {
    // return library id if library exists
    if (this.breadcrumb.library) {
      return this.breadcrumb.library.id;
    }
    // default
    return undefined;
  }

  public decode(link: string): Breadcrumb {
    // decode link string
    return Breadcrumb.parse(JSON.parse(decodeURI(this.b64DecodeUnicode(atob(link)))));
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
