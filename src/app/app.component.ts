import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'RecruitMe';
  version = 'Demo Version - 0.2';

  constructor() {
  }
}
