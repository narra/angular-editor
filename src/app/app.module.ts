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

import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClarityModule} from '@clr/angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {ErrorInterceptor, JwtInterceptor} from '@app/interceptors';
import {AppInitService} from '@app/app-init.service';
import {
  AddLibraryWizardComponent,
  CreateItemWizardComponent,
  CreateLibraryWizardComponent,
  CreateProjectWizardComponent,
  AdminConnectorsComponent,
  AdminGeneratorsComponent,
  AdminSettingsComponent,
  AdminSynthesizersComponent,
  AdminSystemComponent,
  AdminUsersComponent,
  BadgeComponent,
  BreadcrumbsComponent,
  HeaderComponent,
  ItemsMainComponent,
  ItemsMetadataComponent,
  LibrariesContributorsComponent,
  LibrariesDashboardComponent,
  LibrariesMainComponent,
  LibrariesMetadataComponent,
  LibrariesSettingsComponent,
  LoaderComponent,
  LoginComponent,
  MessagesComponent,
  NavigationComponent,
  PlaceholderComponent,
  ProjectsContributorsComponent,
  ProjectsDashboardComponent,
  ProjectsMainComponent,
  ProjectsSettingsComponent,
  ProjectsMetadataComponent,
  ScenariosDashboardComponent
} from '@app/components';
import {DropDirective} from '@app/directives';

export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ProjectsDashboardComponent,
    LibrariesDashboardComponent,
    AdminSystemComponent,
    AdminUsersComponent,
    LoginComponent,
    LoaderComponent,
    HeaderComponent,
    CreateProjectWizardComponent,
    CreateLibraryWizardComponent,
    CreateItemWizardComponent,
    PlaceholderComponent,
    ScenariosDashboardComponent,
    AdminConnectorsComponent,
    AdminGeneratorsComponent,
    AdminSynthesizersComponent,
    NavigationComponent,
    ProjectsContributorsComponent,
    ProjectsSettingsComponent,
    BadgeComponent,
    AdminSettingsComponent,
    ProjectsMainComponent,
    LibrariesMainComponent,
    LibrariesContributorsComponent,
    LibrariesSettingsComponent,
    BreadcrumbsComponent,
    AddLibraryWizardComponent,
    DropDirective,
    ItemsMainComponent,
    MessagesComponent,
    ProjectsMetadataComponent,
    LibrariesMetadataComponent,
    ItemsMetadataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AppInitService,
    {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitService, HttpClientModule], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
