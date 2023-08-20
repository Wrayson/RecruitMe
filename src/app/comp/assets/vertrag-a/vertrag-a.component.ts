import {Component, Input} from '@angular/core';
import {FormService} from "../../../form.service";
import jsPDF from "jspdf";
import {ActivatedRoute} from "@angular/router";
import {Form, FormGroup} from "@angular/forms";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-vertrag-a',
  templateUrl: './vertrag-a.component.html'
})
export class VertragAComponent{
  constructor(public service: FormService) {
  }
}
