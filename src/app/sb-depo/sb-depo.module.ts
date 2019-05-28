import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SbDepoComponent } from "./sb-depo.component";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: "", component: SbDepoComponent }])
  ],
  declarations: [SbDepoComponent]
})
export class SbDepoModule {}
