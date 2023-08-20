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

import { FormComponent } from './form/form.component';
import { WorkComponent } from './comp/work/work.component';
import {PersonalComponent} from "./comp/personal/personal.component";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { VertragAComponent } from './comp/assets/vertrag-a/vertrag-a.component';
import { VertragBComponent } from './comp/assets/vertrag-b/vertrag-b.component';
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    PersonalComponent,
    WorkComponent,
    VertragAComponent,
    VertragBComponent,
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
