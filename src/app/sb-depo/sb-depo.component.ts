import { Component, OnInit } from "@angular/core";
import { sbDepo } from "../shared";
import { DbService } from "../shared/db.service";
import { ToastController } from "@ionic/angular";
declare var require: any;
const roundTo = require("round-to");

@Component({
  selector: "app-sb-depo",
  templateUrl: "./sb-depo.component.html",
  styleUrls: ["./sb-depo.component.scss"]
})
export class SbDepoComponent implements OnInit {
  sbDepos: sbDepo[] = [];
  sbDeposOri: sbDepo[] = [];
  newSb: sbDepo[] = [];
  jns: number;
  tabIdx: number = -1;

  // private db: DbService
  constructor(private db: DbService, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.loadSbDepo();
        this.db.getSbDepos().subscribe(res => (this.sbDeposOri = res));
      }
    });
  }

  setTabIndex() {
    this.tabIdx += 1;
    return this.tabIdx;
  }

  tabChange(e) {
    this.jns = +e.detail.value;
    this.sbDepos = this.sbDeposOri.filter(f => f.jw == this.jns);
    this.newSb = [];
    // if (this.sbDepos[this.sbDepos.length - 1].nominal > 0)
    this.newSb = [...this.newSb, new sbDepo(this.jns, null, null)];
  }

  nomChange(idx) {
    if (idx == 0 && this.newSb.length == 1) {
      if (this.sbDepos.length > 0) {
        if (
          this.newSb[idx].nominal >
          this.sbDepos[this.sbDepos.length - 1].nominal + 1
        )
          this.newSb = [...this.newSb, new sbDepo(this.jns, null, null)];
      } else this.newSb = [...this.newSb, new sbDepo(this.jns, null, null)];
    } else {
      if (
        idx > 0 &&
        this.newSb[idx].nominal > this.newSb[idx - 1].nominal + 1
      ) {
        if (idx + 1 == this.newSb.length)
          this.newSb = [...this.newSb, new sbDepo(this.jns, null, null)];
        if (
          this.newSb.length > idx + 1 &&
          this.newSb[idx + 1].nominal <= this.newSb[idx].nominal &&
          this.newSb[idx + 1].nominal != null
        )
          this.newSb.splice(idx + 1, 1);
      } else {
        if (
          this.newSb.length > idx + 1 &&
          this.newSb[idx + 1].nominal <= this.newSb[idx].nominal &&
          this.newSb[idx + 1].nominal != null
        )
          this.newSb.splice(idx + 1, 1);
      }
    }
  }

  nomChange2(idx) {
    if (idx == this.sbDepos.length - 1) {
      if (idx == 0 && this.newSb.length == 0)
        this.newSb = [...this.newSb, new sbDepo(this.jns, null, null)];
    }
  }

  urutNewSb(i) {
    return this.sbDepos.length > 0 && this.newSb.length == 1
      ? this.sbDepos[this.sbDepos.length - 1].nominal + 1
      : i > 0
      ? this.newSb[i - 1].nominal + 1
      : 1;
  }

  update() {
    this.newSb.forEach(fe => {
      if (fe.nominal != null && fe.sb != null)
        this.sbDepos = [...this.sbDepos, fe];
    });
    this.newSb = [];
    this.newSb = [...this.newSb, new sbDepo(this.jns, null, null)];
    // Update ke database
    this.db.deleteSbDepo(this.jns);
    this.sbDepos.forEach(fe => {
      fe.sbBln = fe.sb <= 0 ? 0 : roundTo(fe.sb / 12, 2);
      this.db
        .addSbDepo(fe)
        .then(_ => this.showMessage("Suku bunga disimpan..."));
    });
  }

  async showMessage(
    msg: string,
    position?: "top" | "middle" | "bottom",
    title: string = "",
    durasi: number = 2000
  ) {
    const toast = await this.toastCtrl.create({
      header: title,
      message: msg,
      position: position == undefined ? "middle" : position,
      duration: durasi
    });
    toast.present();
  }
}
