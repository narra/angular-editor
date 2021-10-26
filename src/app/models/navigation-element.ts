/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {NavigationType, RelationType, TargetType} from '@app/enums';

export interface NavigationElement {
  title: string;
  type: NavigationType;
  segments: string[];
  target: TargetType;
  allow: RelationType[];
}
