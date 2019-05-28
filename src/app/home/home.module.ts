import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { IonicModule } from "@ionic/angular";
import { HomeRoutingModule } from "./home.router.module";

@NgModule({
  imports: [CommonModule, IonicModule, HomeRoutingModule],
  declarations: [HomeComponent]
})
export class HomeModule {}
