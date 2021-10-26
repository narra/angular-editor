/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
      if (object.author.email === user.email) {
        relation = RelationType.owned;
      } else if (object.hasOwnProperty('contributors')) {
        object.contributors.forEach(contributor => {
          if (contributor.email === user.email) {
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
