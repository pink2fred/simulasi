import { Component, ViewChildren, QueryList } from "@angular/core";

import {
  Platform,
  ActionSheetController,
  PopoverController,
  ModalController,
  MenuController,
  IonRouterOutlet
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { Toast } from "@ionic-native/toast/ngx";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Storage } from "@ionic/storage";
import { AboutPage } from "./about/about.page";
import { AppVersion } from "@ionic-native/app-version/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    private menu: MenuController,
    private router: Router,
    private toast: Toast,
    private splashScreen: SplashScreen,
    private kb: Keyboard,
    private statusBar: StatusBar,
    private permissions: AndroidPermissions,
    private appVer: AppVersion,
    private storage: Storage
  ) {
    this.initializeApp();
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.kb.hideFormAccessoryBar(false);
      this.permissions
        .checkPermission(this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
        .then(result => {
          if (!result.hasPermission) {
            this.permissions.requestPermission(
              this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE
            );
          }
        });

      this.appVer.getVersionNumber().then(versi => {
        this.storage.get("versi").then(val => {
          if (val == null || val != versi) {
            this.presentAbout();
            this.storage.set("versi", versi);
          }
        });
      });
    });
  }

  async presentAbout() {
    const modal = await this.modalCtrl.create({
      component: AboutPage,
      cssClass: "custom-modal-css"
    });
    return await modal.present();
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      // close action sheet
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {}

      // close popover
      try {
        const element = await this.popoverCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {}

      // close modal
      try {
        const element = await this.modalCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
        console.log(error);
      }

      // close side menua
      try {
        const element = await this.menu.getOpen();
        if (element) {
          this.menu.close();
          return;
        }
      } catch (error) {}

      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this.router.url === "/home") {
          if (
            new Date().getTime() - this.lastTimeBackPress <
            this.timePeriodToExit
          ) {
            // this.platform.exitApp(); // Exit from app
            navigator["app"].exitApp(); // work in ionic 4
          } else {
            this.toast
              .show(`Press back again to exit App.`, "2000", "center")
              .subscribe(toast => {
                // console.log(JSON.stringify(toast));
              });
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }
}
