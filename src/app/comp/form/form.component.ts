import {Component, Input} from '@angular/core';
import {FormService} from "../../form.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {

  //On Form submit, create Service for Contract creation.
  onSubmit() {
    //this.router.navigate(['/vertrag'])
  }

  constructor(public form:FormService, public router:Router) {
  }
}
