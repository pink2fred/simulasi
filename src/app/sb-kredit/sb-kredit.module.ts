import { IonicModule } from "@ionic/angular";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SbKreditComponent } from "./sb-kredit.component";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: "", component: SbKreditComponent }])
  ],
  declarations: [SbKreditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SbKreditModule {}
