import {Component, SkipSelf} from '@angular/core';
import {ControlContainer, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher, MAT_DATE_LOCALE} from "@angular/material/core";
import {countries} from "../../countrylist/country-data-store";
import {FormService} from "../../../../form.service";
import { SeparatorDirective } from "../../directives/separator.directive";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }],
  providers: []
})

export class PersonalComponent {
  public countries:any = countries;
  public allowance:boolean = false;




  public setSelectedCountry(value: any) {
    if (value === "Schweiz") {
      this.allowance = false;
    } else {
      this.allowance = true;
    }
  }

  constructor(public form:FormService) {
  }

}
