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

export enum EventType {
  auth_login,
  auth_logout,
  create_project,
  create_library,
  create_scenario,
  create_item,
  add_library,
  project_created,
  project_updated,
  project_deleted,
  library_created,
  library_updated,
  library_purged,
  library_deleted,
  item_created,
  item_updated,
  item_deleted,
  user_preferences_updated,
  navigation_changed,
  message
}