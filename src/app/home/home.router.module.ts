import { TabsPageModule } from "./../tabs/tabs.module";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "../tabs/tabs.page";
import { HomeComponent } from "./home.component";
import { SimDepoComponent } from "../sim-depo/sim-depo.component";
import { SimDepoModule } from "../sim-depo/sim-depo.module";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "simulasi",
    children: [
      {
        path: "kpeg",
        loadChildren: "../tab2/tab2.module#Tab2PageModule"
      },
      {
        path: "kpens",
        loadChildren: "../tab1/tab1.module#Tab1PageModule"
      },
      {
        path: "kpeg+",
        loadChildren: "../tab3/tab3.module#Tab3PageModule"
      },
      {
        path: "depo",
        loadChildren: "../sim-depo/sim-depo.module#SimDepoModule"
      }
      //   { path: "", redirectTo: "/simulasi/kpeg", pathMatch: "full" }
    ]
  },
  {
    path: "param",
    children: [
      {
        path: "sbKrd",
        loadChildren: "../sb-kredit/sb-kredit.module#SbKreditModule"
      },
      {
        path: "sbDepo",
        loadChildren: "../sb-depo/sb-depo.module#SbDepoModule"
      }
      //   { path: "", redirectTo: "/simulasi/kpeg", pathMatch: "full" }
    ]
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
