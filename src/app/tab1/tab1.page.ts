import { Component, OnInit } from "@angular/core";
import { CustomCurrencyPipe } from "../shared/currency.pipe";
import {
  sbKrd,
  potongan,
  asuransi,
  IhistSimKrd,
  convertDate,
  asuransi2
} from "../shared";
import * as moment from "moment";
import {
  ModalController,
  AlertController,
  ToastController
} from "@ionic/angular";
import { ModalResultComponent } from "../modal-result/modal-result.component";
import { DbService } from "../shared/db.service";
import { HistKrdPage } from "../hist-krd/hist-krd.page";
declare var require: any;
const roundTo = require("round-to");

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit {
  paramSb: sbKrd[]; // sbKrd.sbPens().filter(f => f.jenis == 2);
  nama: string;
  plafon: number;
  lunas: number;
  sb: sbKrd = null;
  jw: number;
  angs: number;
  gaji: number;
  tglMulai: string = moment().toISOString();
  tglLhr: string = ""; // moment("10-15-1962", "MM-DD-YYYY").toISOString();
  umurPensiun: number = 75;
  persenGaji: number;
  isLunas = false;
  jnsAss: string = "";
  maxTglLhr = moment()
    .add(-35, "years")
    .format("YYYY");

  isEditPersen = false;
  isEditJw = false;
  isEditPlf = false;
  isEditAss = true;

  constructor(
    private currPipe: CustomCurrencyPipe,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private db: DbService
  ) {}

  ngOnInit() {
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.loadSbLoan();
        this.db
          .getSbLoans()
          .subscribe(res => (this.paramSb = res.filter(f => f.jenis == 2)));
      }
    });
  }

  hitung() {
    this.presentModal();
  }

  simpan() {
    this.db
      .addHistLoan({
        id: 0,
        jenis: 2,
        nama: this.nama,
        tglLhr: new Date(this.tglLhr),
        gaji: this.gaji,
        honor: 0,
        umurPensiun: this.umurPensiun,
        plafon: this.plafon,
        jw: this.jw,
        lunas: this.lunas == undefined ? 0 : this.lunas,
        jnsAss: this.jnsAss
      })
      .then(_ => this.showMessage("Simulasi telah disimpan ke riwayat..."));
  }

  async presentConfirm() {
    const alert = await this.alertCtrl.create({
      header: "Konfirmasi!",
      message:
        "Jumlah Gaji = Rp. " +
        this.currPipe.transform(this.gaji, 0) +
        "<br/>Plafon = Rp. " +
        this.currPipe.transform(this.plafon, 0) +
        "<br/>Jangka Waktu = " +
        this.jw +
        " Bulan" +
        "<br/>Suku Bunga = " +
        this.sb.sbBln +
        "% p.m" +
        "<br/>Angsuran/Bulan = Rp. " +
        this.currPipe.transform(this.angs, 0),
      cssClass: "confirm-alert alert-title-center",
      buttons: [
        { text: "Cancel", role: "cancel", cssClass: "secondary" },
        {
          text: "Lanjut ->",
          cssClass: "primary",
          handler: () => {
            this.hitung();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentHistory() {
    this.isEditAss = false;
    let modal = await this.modalCtrl.create({
      component: HistKrdPage,
      componentProps: { jenis: 2 }
    });
    modal
      .onDidDismiss()
      .then(data => {
        if (data.data != undefined) {
          let history = data.data as IhistSimKrd;
          this.nama = history.nama;
          this.tglLhr = moment(
            convertDate(history.tglLhr),
            "MM-DD-YYYY"
          ).toISOString();
          this.umurPensiun = history.umurPensiun;
          this.gaji = history.gaji;
          this.jnsAss = history.jnsAss;
          const jwMax = this.hitungJw(history.jnsAss);
          if (history.jw > jwMax)
            this.showMessage(
              "Jangka waktu disesuaikan dengan jangka waktu maksimal yang dapat diberikan yaitu " +
                jwMax +
                " Bulan",
              "middle",
              "",
              5000
            );
          this.jw = history.jw > jwMax ? jwMax : history.jw;
          this.isEditPlf = true;
          this.plafon = history.plafon;
          this.lunas = history.lunas;
          this.isLunas = history.lunas > 0 ? true : false;
        }
      })
      .then(_ => (this.isEditAss = true));
    return await modal.present();
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalResultComponent,
      cssClass: "custom-modal-css",
      componentProps: {
        jns: "Kredit Pensiun",
        nama: this.nama,
        plafon: this.plafon,
        jw: this.jw,
        gaji: this.gaji,
        angs: this.angs,
        sb: this.sb,
        tglMulai: new Date(this.tglMulai),
        tglLhr: new Date(this.tglLhr),
        umurPensiun: this.umurPensiun,
        pelunasan: this.lunas == undefined ? 0 : this.lunas,
        jnsAss: this.jnsAss
      }
    });
    return await modal.present();
  }

  getJwMax(val?) {
    if (this.isEditAss) {
      this.jw = this.hitungJw(val);
    }
  }

  hitungJw(val?) {
    const usia = moment(new Date(this.tglMulai)).diff(
      moment(new Date(this.tglLhr)),
      "years"
    );
    let Ass: any[];
    let selAss: asuransi;
    let selAss2: asuransi2;
    if (val == "askrida") Ass = asuransi.askrida();
    if (val == "taspen") Ass = asuransi.taspen();
    if (val == "askrindo") Ass = asuransi.askrindo();
    if (val == "avrist") Ass = asuransi2.avrist();
    this.umurPensiun = Math.max(...Ass.map(o => o.usia), 0);
    if (val != "avrist") {
      selAss = Ass.find(f => f.usia == usia);
      for (let i = 20; i > 0; i--) {
        if (selAss["jw" + i.toString()] != undefined) {
          if (this.jw == undefined || this.jw > i * 12) this.jw = i * 12;
          break;
        }
      }
    } else {
      selAss2 = Ass.find(f => f.usia == usia);
      for (let i = 180; i > 0; i -= 6) {
        if (selAss2["jw" + i.toString()] != undefined) {
          if (this.jw == undefined || this.jw > i) this.jw = i;
          break;
        }
      }
    }
    const tglPens = moment(new Date(this.tglLhr)).add(this.umurPensiun, "y");
    const maxJwPens = tglPens.diff(moment(new Date(this.tglMulai)), "months");
    return this.jw > 240 ? 240 : this.jw <= maxJwPens ? this.jw : maxJwPens;
  }

  calcPlafon(value?) {
    if (this.isEditPersen) {
      const gaji = this.gaji;
      this.persenGaji = +value;
      this.angs = (+gaji * this.persenGaji) / 100;
      this.paramSb.forEach((val, i, arr) => {
        let jwBef = i <= 0 ? 0 : arr[i - 1].jw;
        if (this.jw > jwBef && this.jw <= val.jw) this.sb = val;
      });
      let revPok = 1 / this.jw;
      let revBng = this.sb.sbBln / 100;
      this.plafon = roundTo(this.angs / (revPok + revBng), -4);
    }
  }

  calcAngs(kode, value?) {
    if (this.isEditJw || this.isEditPlf) {
      const valJw = kode == 2 ? value : this.jw;
      const valPlf = kode == 3 ? value : this.plafon;
      this.paramSb.forEach((val, i, arr) => {
        let jwBef = i <= 0 ? 0 : arr[i - 1].jw;
        if (valJw > jwBef && valJw <= val.jw) this.sb = val;
      });
      const bng = this.sb ? this.sb.sbBln / 100 : 0;
      const angsStr = (roundTo(
        valPlf / valJw + valPlf * bng,
        0
      ) as number).toString();
      const bulat50 =
        +angsStr.substr(angsStr.length - 2, 2) <= 50
          ? 50 - +angsStr.substr(angsStr.length - 2, 2)
          : 100 - +angsStr.substr(angsStr.length - 2, 2);
      this.angs = +angsStr + bulat50;
      this.persenGaji = roundTo((this.angs / this.gaji) * 100, 2);
      this.persenGaji = isNaN(this.persenGaji) ? 0 : this.persenGaji;
    }
  }

  btnDisabled() {
    return (
      this.tglLhr == "" ||
      this.umurPensiun <= 0 ||
      (this.gaji == 0 || this.gaji == null) ||
      (this.persenGaji <= 0 || this.persenGaji == null) ||
      this.jnsAss == "" ||
      this.jw <= 0 ||
      (this.plafon == 0 || this.plafon == null)
    );
  }

  isNan(value) {
    return !isNaN(value);
  }

  roundTo(value, decimals?) {
    decimals = decimals || 0;
    return roundTo(value, decimals);
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
