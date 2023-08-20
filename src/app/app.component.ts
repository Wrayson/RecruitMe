import {Component, Input} from '@angular/core';
import {FormService} from "./form.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RecruitMe';

  constructor() {
  }
}
