import {Component, Input, SkipSelf} from '@angular/core';
import {ControlContainer} from "@angular/forms";
import {FormService} from "../../../../form.service";

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }],
  providers: []
})
export class WorkComponent {

  constructor(public form:FormService) {
  }

}
