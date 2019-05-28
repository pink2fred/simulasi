import { Component, OnInit } from "@angular/core";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { version } from "../shared";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-about",
  templateUrl: "./about.page.html",
  styleUrls: ["./about.page.scss"]
})
export class AboutPage implements OnInit {
  appName: string;
  appVerNum: string;
  versionLog: version[] = version.init();

  constructor(private view: ModalController, private appVer: AppVersion) {
    appVer.getAppName().then(res => (this.appName = res));
    appVer.getVersionNumber().then(versi => (this.appVerNum = versi));
  }

  ngOnInit() {}

  closeModal() {
    this.view.dismiss();
  }
}
