/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {narra} from '@narra/api';

export class ScenarioHelper {

  static filterInclude(array: narra.Scenario[], include: narra.ScenarioType): narra.Scenario[] {
    return array.filter(scenario => {
      return scenario.type === include;
    });
  }
}
