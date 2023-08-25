import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from "./comp/form/form.component";
import {VersionComponent} from "./comp/version/version.component";
import {StartComponent} from "./comp/start/start.component";
import {ViewerComponent} from "./comp/viewer/viewer.component";

const routes: Routes = [
  {path: 'start' , component: StartComponent, title: "rockstar* RecruitMe"},
  {path: 'onboarding' , component: FormComponent, title: "rockstar* RecruitMe - Onboarding"},
  {path: 'viewer' , component: ViewerComponent, title: "rockstar* RecruitMe - Viewer"},
  {path: 'version' , component: VersionComponent, title: "rockstar* RecruitMe - Version"},
  {path: '', component: StartComponent, title: "rockstar* RecruitMe"},
  {path: '**', component: StartComponent, title: "rockstar* RecruitMe"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
