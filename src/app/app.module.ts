/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
  AdminActionsComponent,
  AdminLogComponent,
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
import {LimitPipe} from '@app/pipes';

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
    ItemsMetadataComponent,
    AdminActionsComponent,
    AdminLogComponent,
    LimitPipe
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
