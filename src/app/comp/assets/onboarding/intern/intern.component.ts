import {Component, SkipSelf} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {FormService} from "../../../../form.service";

@Component({
  selector: 'app-intern',
  templateUrl: './intern.component.html',
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }],
  providers: []
})
export class InternComponent {

  constructor(public form:FormService) {
  }

}
