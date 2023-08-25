import {Component, SkipSelf} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {FormService} from "../../../../form.service";
import {countries} from "../../countrylist/country-data-store";

@Component({
  selector: 'app-extern',
  templateUrl: './extern.component.html',
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }],
  providers: []
})
export class ExternComponent {
  public countries:any = countries;

  constructor(public form:FormService) {
  }
}
