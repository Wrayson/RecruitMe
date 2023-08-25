import {AfterViewChecked, ChangeDetectorRef, Component} from '@angular/core';
import {FormService} from "../../form.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-onboarding',
  templateUrl: './form.component.html',
})
export class FormComponent implements AfterViewChecked{

  onSubmit() {
    //this.router.navigate(['/vertrag'])
  }

  constructor(public form:FormService, public router:Router, private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
}
