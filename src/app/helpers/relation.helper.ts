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

import {RelationType} from '@app/enums';
import {narra} from '@narra/api';

export class RelationHelper {

  static isRelationship(type: RelationType, object: any, user: narra.User) {
    return this.getRelationship(object, user) === type;
  }

  static getRelationship(object: any, user: narra.User): RelationType {
    // default relation
    let relation = RelationType.unknown;
    // try to figure it out
    if (object.hasOwnProperty('author')) {
      if (object.author.username === user.username) {
        relation = RelationType.owned;
      } else if (object.hasOwnProperty('contributors')) {
        object.contributors.forEach(contributor => {
          if (contributor.username === user.username) {
            relation =  RelationType.contributed;
          }
        });
      }
      // check if it is shared
      if (relation === RelationType.unknown && object.hasOwnProperty('shared')) {
        if (object.shared) {
          relation = RelationType.shared;
        }
      }
    }
    // all other marked as shared
    return relation;
  }
}
