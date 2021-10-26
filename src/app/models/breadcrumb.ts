/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {BreadcrumbElement} from '@app/models';

export class Breadcrumb {
  project: BreadcrumbElement;
  library: BreadcrumbElement;
  item: BreadcrumbElement;

  constructor(project?: BreadcrumbElement, library?: BreadcrumbElement, item?: BreadcrumbElement) {
    this.project = project;
    this.library = library;
    this.item = item;
  }

  public static parse(decoded: any): Breadcrumb {
    return new Breadcrumb(decoded.project, decoded.library, decoded.item);
  }

  public getQueryParams(element: BreadcrumbElement): any {
    if (element.pagination) {
      return {page: element.pagination.page, perPage: element.pagination.perPage, offset: element.pagination.offset};
    } else {
      return {};
    }
  }
}

