import {Component, SkipSelf} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {countries} from "../../countrylist/country-data-store";
import {FormService} from "../../../../form.service";


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
  private allowance:boolean = false;

  public getAllowanceNeeded(){
    return this.allowance;
  }

  public setAllowanceByCountry(value: any) {
    if (value === "Schweiz") {
      this.allowance = false;
    } else {
      this.allowance = true;
    }
  }

  constructor(public form:FormService) {
  }

}
