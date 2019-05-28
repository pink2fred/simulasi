import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SimDepoComponent } from "./sim-depo.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: "", component: SimDepoComponent }])
  ],
  declarations: [SimDepoComponent]
})
export class SimDepoModule {}
