import { Component, OnInit } from "@angular/core";
import { IsbLoan, sbKrd } from "../shared";
import { DbService } from "../shared/db.service";
import { ToastController } from "@ionic/angular";
declare var require: any;
const roundTo = require("round-to");

@Component({
  selector: "app-sb-kredit",
  templateUrl: "./sb-kredit.component.html",
  styleUrls: ["./sb-kredit.component.scss"]
})
export class SbKreditComponent implements OnInit {
  sbLoans: sbKrd[] = [];
  SbLoansOri: sbKrd[] = [];
  newSb: sbKrd[] = [];
  jns: number;

  // private db: DbService
  constructor(private db: DbService, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.loadSbLoan();
        this.db.getSbLoans().subscribe(res => (this.SbLoansOri = res));
      }
    });
  }

  segmentChange(e) {
    this.krdChange(+e.detail.value);
  }

  krdChange(jenis) {
    this.jns = jenis;
    this.sbLoans = this.SbLoansOri.filter(f => f.jenis == this.jns);
    this.newSb = [];
    // if (this.sbLoans[this.sbLoans.length - 1].jw > 0)
    this.newSb = [...this.newSb, new sbKrd(this.jns, null, null)];
  }

  jwChange(idx) {
    if (idx == 0 && this.newSb.length == 1) {
      if (this.sbLoans.length > 0) {
        if (this.newSb[idx].jw > this.sbLoans[this.sbLoans.length - 1].jw + 1)
          this.newSb = [...this.newSb, new sbKrd(this.jns, null, null)];
      } else this.newSb = [...this.newSb, new sbKrd(this.jns, null, null)];
    } else {
      if (idx > 0 && this.newSb[idx].jw > this.newSb[idx - 1].jw + 1) {
        if (idx + 1 == this.newSb.length)
          this.newSb = [...this.newSb, new sbKrd(this.jns, null, null)];
        if (
          this.newSb.length > idx + 1 &&
          this.newSb[idx + 1].jw <= this.newSb[idx].jw &&
          this.newSb[idx + 1].jw != null
        )
          this.newSb.splice(idx + 1, 1);
      } else {
        if (
          this.newSb.length > idx + 1 &&
          this.newSb[idx + 1].jw <= this.newSb[idx].jw &&
          this.newSb[idx + 1].jw != null
        )
          this.newSb.splice(idx + 1, 1);
      }
    }
  }

  jwChange2(idx) {
    if (idx == this.sbLoans.length - 1) {
      if (idx == 0 && this.newSb.length == 0)
        this.newSb = [...this.newSb, new sbKrd(this.jns, null, null)];
    }
  }

  urutNewSb(i) {
    return this.sbLoans.length > 0 && this.newSb.length == 1
      ? this.sbLoans[this.sbLoans.length - 1].jw + 1
      : i > 0
      ? this.newSb[i - 1].jw + 1
      : 1;
  }

  update() {
    this.newSb.forEach(fe => {
      if (fe.jw != null && fe.sb != null) this.sbLoans = [...this.sbLoans, fe];
    });
    this.newSb = [];
    // if (this.sbLoans[this.sbLoans.length - 1].jw > 0)
    this.newSb = [...this.newSb, new sbKrd(this.jns, null, null)];
    // Update ke database
    this.db.deleteSbLoan(this.jns);
    this.sbLoans.forEach(fe => {
      fe.sbBln = fe.sb <= 0 ? 0 : roundTo(fe.sb / 12, 2);
      this.db
        .addSbLoan(fe)
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
