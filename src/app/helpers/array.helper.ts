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
        return author.username;
      }).includes(object.author.username)) {
        inclusionFlag = true;
      } else {
        // process contributors
        include.forEach(inclusion => {
          if (object.contributors.map(author => {
            return author.username;
          }).includes(inclusion.username)) {
            inclusionFlag = true;
          }
        });
      }
      // moving on
      return inclusionFlag;
    });
  }
}
