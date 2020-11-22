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

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '@app/guards/auth.guard';
import {narra} from '@narra/api';
import {
  AdminConnectorsComponent,
  AdminGeneratorsComponent,
  AdminSettingsComponent,
  AdminSynthesizersComponent,
  AdminSystemComponent,
  AdminUsersComponent,
  ItemsMainComponent,
  LibrariesContributorsComponent,
  LibrariesDashboardComponent,
  LibrariesMainComponent,
  LibrariesSettingsComponent,
  LoginComponent,
  ProjectsContributorsComponent,
  ProjectsDashboardComponent,
  ProjectsMainComponent,
  ProjectsSettingsComponent,
  ScenariosDashboardComponent
} from '@app/components';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'projects', component: ProjectsDashboardComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'projects/:name', redirectTo: 'projects/:name/main', pathMatch: 'full'},
  {path: 'projects/:name/main', component: ProjectsMainComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'projects/:name/contributors', component: ProjectsContributorsComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'projects/:name/settings', component: ProjectsSettingsComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'libraries', component: LibrariesDashboardComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'libraries/:id', redirectTo: 'libraries/:id/main', pathMatch: 'full'},
  {path: 'libraries/:id/main', component: LibrariesMainComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'libraries/:id/contributors', component: LibrariesContributorsComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'libraries/:id/settings', component: LibrariesSettingsComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'items/:id', redirectTo: 'items/:id/main', pathMatch: 'full'},
  {path: 'items/:id/main', component: ItemsMainComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'scenarios', component: ScenariosDashboardComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.author]}},
  {path: 'admin', redirectTo: '/admin/system', pathMatch: 'full'},
  {path: 'admin/system', component: AdminSystemComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.admin]}},
  {path: 'admin/connectors', component: AdminConnectorsComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.admin]}},
  {path: 'admin/generators', component: AdminGeneratorsComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.admin]}},
  {path: 'admin/synthesizers', component: AdminSynthesizersComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.admin]}},
  {path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.admin]}},
  {path: 'admin/settings', component: AdminSettingsComponent, canActivate: [AuthGuard], data: {roles: [narra.RoleType.admin]}},
  {path: '', redirectTo: '/projects', pathMatch: 'full'},
  {path: '**', redirectTo: '/projects'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
