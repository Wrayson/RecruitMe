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
import { WorkComponent } from './comp/assets/form/work/work.component';
import {PersonalComponent} from "./comp/assets/form/personal/personal.component";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import { RecruitingComponent } from './comp/assets/form/recruiting/recruiting.component';
import { VersionComponent } from './comp/version/version.component';
import { NomatchComponent } from './comp/assets/contracts/nomatch/nomatch.component';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    PersonalComponent,
    WorkComponent,
    RecruitingComponent,
    VersionComponent,
    NomatchComponent,
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
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
