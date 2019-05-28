import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { SQLite } from "@ionic-native/sqlite/ngx";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { HttpClientModule } from "@angular/common/http";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { ModalResultComponent } from "./modal-result/modal-result.component";
import { Toast } from "@ionic-native/toast/ngx";
import { DepoResultPage } from "./depo-result/depo-result.page";
import { HistKrdPage } from "./hist-krd/hist-krd.page";
import { HistDepoPage } from "./hist-depo/hist-depo.page";
import { AboutPage } from "./about/about.page";

@NgModule({
  declarations: [
    AppComponent,
    ModalResultComponent,
    DepoResultPage,
    HistKrdPage,
    HistDepoPage,
    AboutPage
  ],
  entryComponents: [
    ModalResultComponent,
    DepoResultPage,
    HistKrdPage,
    HistDepoPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Toast,
    SQLite,
    SQLitePorter,
    AndroidPermissions,
    AppVersion
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
