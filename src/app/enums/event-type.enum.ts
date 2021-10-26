/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
  library_deleted,
  library_cleaned,
  item_created,
  item_updated,
  item_deleted,
  action_performed,
  events_updated,
  user_preferences_updated,
  navigation_changed,
  message
}
