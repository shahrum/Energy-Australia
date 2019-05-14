import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { CarCreateComponent } from "./car-create/car-create.component";
import { CarListComponent } from "./car-list/car-list.component";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [CarCreateComponent, CarListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class CarsModule {}
