import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from "./form/form.component";
import {VertragAComponent} from "./comp/assets/vertrag-a/vertrag-a.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  {path: 'form' , component: FormComponent},
  {path: 'vertrag' , component: VertragAComponent},
  {path: '', component: FormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
