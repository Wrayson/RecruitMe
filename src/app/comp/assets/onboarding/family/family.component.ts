import {Component, SkipSelf} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {FormService} from "../../../../form.service";

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }],
  providers: []
})
export class FamilyComponent {
  constructor(public form:FormService) {

  }
}
