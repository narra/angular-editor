/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {narra} from '@narra/api';

export class ArrayHelper {

  static isEqual(x: any[], y: any[]) {
    return x.length === y.length && [x, y].reduce((a, b) => a.filter(c => !b.includes(c))).length === 0;
  }

  static difference(x: any[], y: any[]) {
    return [x, y].reduce((a, b) => a.filter(c => !b.includes(c)));
  }

  static pluck(array: any[], attribute: string) {
    return array.map(x => {
      return x[attribute];
    });
  }

  static sort(key: string, array: any[]): any[] {
    const sortBy = (key) => {
      return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
    };
    return array.concat().sort(sortBy(key));
  }

  static chunk(array: any[], size: number) {
    return array.reduce((arr, item, idx) => {
      return idx % size === 0
        ? [...arr, [item]]
        : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
    }, []);
  }

  static filterIncludeAuthors<T extends narra.Authorship>(array: T[], include: narra.Author[]): T[] {
    return array.filter(object => {
      // inclusion flag
      let inclusionFlag = false;
      // process author
      // exception for shared Libraries
      if ('shared' in object && (object as unknown as narra.Library).shared) {
        inclusionFlag = true;
      } else if (include.map(author => {
        return author.email;
      }).includes(object.author.email)) {
        inclusionFlag = true;
      } else {
        // process contributors
        include.forEach(inclusion => {
          if (object.contributors.map(author => {
            return author.email;
          }).includes(inclusion.email)) {
            inclusionFlag = true;
          }
        });
      }
      // moving on
      return inclusionFlag;
    });
  }
}
