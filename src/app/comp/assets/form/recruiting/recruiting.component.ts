import {Component, SkipSelf} from '@angular/core';
import {FormService} from "../../../../form.service";
import {ControlContainer} from "@angular/forms";

@Component({
  selector: 'app-recruiting',
  templateUrl: './recruiting.component.html',
  viewProviders: [{
    provide: ControlContainer,
    useFactory: (container: ControlContainer) => container,
    deps: [[new SkipSelf(), ControlContainer]],
  }],
  providers: []
})

export class RecruitingComponent {

  constructor(public form:FormService) {
  }

}
