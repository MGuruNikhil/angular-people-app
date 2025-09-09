import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { EditPersonComponent } from './edit-person/edit-person.component';
import { DeletePersonComponent } from './delete-person/delete-person.component';
import { PersonService } from './person.service';
import { AppAlertComponent } from './app-alert/app-alert.component';
import { AlertService } from './alert.service';

@NgModule({
  declarations: [
    AppComponent,
    PeopleListComponent,
    EditPersonComponent,
    DeletePersonComponent
    ,AppAlertComponent
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [PersonService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule {}
