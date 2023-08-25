import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatStepperModule} from "@angular/material/stepper";
import {MatInputModule} from "@angular/material/input";
import {MatSelectCountryModule} from "@angular-material-extensions/select-country";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from '@angular/common/http';

import { FormComponent } from './comp/form/form.component';
import { InternComponent } from './comp/assets/onboarding/intern/intern.component';
import {PersonalComponent} from "./comp/assets/onboarding/personal/personal.component";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import { RecruitingComponent } from './comp/assets/onboarding/recruiting/recruiting.component';
import { VersionComponent } from './comp/version/version.component';
import { NomatchComponent } from './comp/assets/contracts/nomatch/nomatch.component';
import { StartComponent } from './comp/start/start.component';
import {MatIconModule} from "@angular/material/icon";
import { ViewerComponent } from './comp/viewer/viewer.component';
import { FamilyComponent } from './comp/assets/onboarding/family/family.component';
import { AhvDirective } from './comp/assets/directives/ahv.directive';
import { ExternComponent } from './comp/assets/onboarding/extern/extern.component';
import { CheDirective } from './comp/assets/directives/che.directive';
import { PhoneDirective } from './comp/assets/directives/phone.directive';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    PersonalComponent,
    InternComponent,
    RecruitingComponent,
    VersionComponent,
    NomatchComponent,
    StartComponent,
    ViewerComponent,
    FamilyComponent,
    AhvDirective,
    ExternComponent,
    CheDirective,
    PhoneDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCardModule,
    MatStepperModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectCountryModule.forRoot('de'),
    HttpClientModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
