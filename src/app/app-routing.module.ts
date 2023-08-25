import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from "./comp/form/form.component";
import {VersionComponent} from "./comp/version/version.component";
import {StartComponent} from "./comp/start/start.component";
import {ViewerComponent} from "./comp/viewer/viewer.component";

const routes: Routes = [
  {path: 'start' , component: StartComponent},
  {path: 'onboarding' , component: FormComponent},
  {path: 'viewer' , component: ViewerComponent},
  {path: 'version' , component: VersionComponent},
  {path: '', component: StartComponent},
  {path: '**', component: StartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
