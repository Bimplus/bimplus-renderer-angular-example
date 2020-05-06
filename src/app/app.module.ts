import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsComponent } from './projects/projects.component';
import { ViewerComponent } from './viewer/viewer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,

    AuthModule,
    FormsModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
