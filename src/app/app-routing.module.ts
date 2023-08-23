import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from "./comp/form/form.component";
import {VersionComponent} from "./comp/version/version.component";

const routes: Routes = [
  {path: 'form' , component: FormComponent},
  {path: 'version' , component: VersionComponent},
  {path: '', component: FormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
