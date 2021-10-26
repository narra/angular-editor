/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
        if (user.email === exclusion.email) {
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
        if (user.email === inclusion.email) {
          // included
          inclusionFlag = true;
        }
      });
      // moving on
      return inclusionFlag;
    });
  }
}
