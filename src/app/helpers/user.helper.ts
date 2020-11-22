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

import {narra} from '@narra/api';

export class UserHelper {

  static isAdmin(user: narra.User): boolean {
    return user.roles.includes(narra.RoleType.admin);
  }

  static filterExclude(array: narra.User[], exclude: narra.Author[]): narra.User[] {
    return array.filter(user => {
      // exclusion flag
      let exlusionFlag = true;
      // process
      exclude.forEach(exclusion => {
        if (user.username === exclusion.username) {
          // excluded
          exlusionFlag = false;
        }
      });
      // moving on
      return exlusionFlag;
    });
  }

  static filterInclude(array: narra.User[], include: narra.Author[]) {
    return array.filter(user => {
      // exclusion flag
      let inclusionFlag = false;
      // process
      include.forEach(inclusion => {
        if (user.username === inclusion.username) {
          // included
          inclusionFlag = true;
        }
      });
      // moving on
      return inclusionFlag;
    });
  }
}
