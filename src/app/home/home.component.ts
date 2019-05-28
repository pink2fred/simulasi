import { Component, OnInit } from "@angular/core";
import { DbService } from "../shared/db.service";
import { sbKrd, convertDate } from "../shared";
import { AlertController, ModalController } from "@ionic/angular";
import { Observable } from "rxjs";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { AboutPage } from "../about/about.page";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  existSbKrdPeg: Promise<boolean>;
  existSbKrdPens: Promise<boolean>;
  // existSbKrdPegPlus: Promise<boolean>;
  existSbDepo1: Promise<boolean>;
  existSbDepo3: Promise<boolean>;
  existSbDepo6: Promise<boolean>;
  appVersion: string;

  constructor(
    private db: DbService,
    private appVer: AppVersion,
    public modalCtrl: ModalController
  ) {
    appVer.getVersionNumber().then(versi => (this.appVersion = versi));
  }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.existSbKrdPeg = this.db.existSbKrd(1);
        this.existSbKrdPens = this.db.existSbKrd(2);
        // this.existSbKrdPegPlus = this.db.existSbKrd(3);

        this.existSbDepo1 = this.db.existSbDepo(1);
        this.existSbDepo3 = this.db.existSbDepo(3);
        this.existSbDepo6 = this.db.existSbDepo(6);
        const tglDel = convertDate(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          true
        );
        this.db.delHistLoan("DATE(inpDate) < '" + tglDel + "'");
        this.db.delHistDepo("DATE(inpDate) < '" + tglDel + "'");
      }
    });
  }

  async presentAbout() {
    const modal = await this.modalCtrl.create({
      component: AboutPage,
      cssClass: "custom-modal-css"
    });
    return await modal.present();
  }
}
