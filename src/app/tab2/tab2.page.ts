import {
  IhistSimKrd,
  convertDate,
  asuransi,
  asuransi2
} from "./../shared/model";
import { Component, OnInit } from "@angular/core";
import { CustomCurrencyPipe } from "../shared/currency.pipe";
import { sbKrd, potongan } from "../shared";
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
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  paramSb: sbKrd[]; // sbKrd.sbPeg().filter(f => f.jenis == 1);
  nama: string;
  plafon: number;
  lunas: number;
  sb: sbKrd = null;
  jw: number;
  angs: number = 0;
  gaji: number;
  honor: number;
  tglMulai: string = moment().toISOString();
  tglLhr: string = ""; // moment("12-12-1970", "MM-DD-YYYY").toISOString();
  umurPensiun: number;
  persenGaji: number;
  persenGajiHonor: number = 0;
  isLunas = false;
  jnsAss: string = "";
  maxTglLhr = moment()
    .add(-20, "years")
    .format("YYYY");

  isEditPersen = false;
  isEditJw = false;
  isEditPlf = false;

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
        this.db.getSbLoans().subscribe(res => {
          this.paramSb = res.filter(f => f.jenis == 1);
        });
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
        jenis: 1,
        nama: this.nama,
        tglLhr: new Date(this.tglLhr),
        gaji: this.gaji,
        honor: this.honor,
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
        "<br/>Penghasilan Tambahan = Rp. " +
        this.currPipe.transform(this.honor, 0) +
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

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalResultComponent,
      cssClass: "custom-modal-css",
      componentProps: {
        jns: "Kredit Pegawai",
        nama: this.nama,
        plafon: this.plafon,
        jw: this.jw,
        gaji: this.gaji,
        honor: this.honor,
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

  async presentHistory() {
    let modal = await this.modalCtrl.create({
      component: HistKrdPage,
      componentProps: { jenis: 1 }
    });
    modal.onDidDismiss().then(data => {
      if (data.data != undefined) {
        let history = data.data as IhistSimKrd;
        this.nama = history.nama;
        this.tglLhr = moment(
          convertDate(history.tglLhr),
          "MM-DD-YYYY"
        ).toISOString();
        this.umurPensiun = history.umurPensiun;
        this.gaji = history.gaji;
        this.honor = history.honor;
        this.jnsAss = history.jnsAss;
        const jwMax = this.hitungJw(history.umurPensiun);
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
    });
    return await modal.present();
  }

  getJwMax(val?) {
    this.umurPensiun = +val;
    this.jw = this.hitungJw(this.umurPensiun);
  }

  hitungJw(val?) {
    const tglPens = moment(new Date(this.tglLhr)).add(val, "y");
    let jw = tglPens.diff(moment(new Date(this.tglMulai)), "months");
    return jw > 240 ? 240 : jw;
  }

  changeAss(e) {
    const kdAss = e.detail.value;
    const tmpJw = this.assJwMax(kdAss);
    if (kdAss == "askrindo" && this.jw > tmpJw) {
      this.jw = tmpJw;
      this.isEditPersen = true;
      this.calcPlafon(this.persenGaji);
      this.isEditPersen = false;
    }
    if (kdAss == "avrist" && this.jw > tmpJw) {
      this.jw = tmpJw;
      this.isEditPersen = true;
      this.calcPlafon(this.persenGaji);
      this.isEditPersen = false;
    }
    if ((kdAss == "askrida" || kdAss == "taspen") && this.jw > tmpJw) {
      this.jw = this.hitungJw(this.umurPensiun);
      this.isEditPersen = true;
      this.calcPlafon(this.persenGaji);
      this.isEditPersen = false;
    }
  }

  assJwMax(jns): number {
    const usia = moment(new Date(this.tglMulai)).diff(
      moment(new Date(this.tglLhr)),
      "years"
    );
    let Ass: any[];
    let selAss: asuransi;
    let selAss2: asuransi2;
    if (jns == "askrida") Ass = asuransi.askrida();
    if (jns == "taspen") Ass = asuransi.taspen();
    if (jns == "askrindo") Ass = asuransi.askrindo();
    if (jns == "avrist") Ass = asuransi2.avrist();
    if (jns != "avrist") {
      selAss = Ass.find(f => f.usia == usia);
      for (let i = 20; i > 0; i--) {
        if (selAss["jw" + i.toString()] != undefined) {
          if (this.jw == undefined || this.jw > i * 12) return i * 12;
          break;
        }
      }
    } else {
      selAss2 = Ass.find(f => f.usia == usia);
      for (let i = 180; i > 0; i -= 6) {
        if (selAss2["jw" + i.toString()] != undefined) {
          if (this.jw == undefined || this.jw > i) return i;
          break;
        }
      }
    }
  }

  calcPlafon(value?) {
    if (this.isEditPersen) {
      const gaji = this.gaji;
      const honor = this.honor;
      this.persenGaji = +value;
      this.angs = ((gaji + honor) * this.persenGaji) / 100;
      this.persenGajiHonor = roundTo((this.angs / gaji) * 100, 2);
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
      const gaji = this.gaji;
      const honor = this.honor;
      this.persenGaji = roundTo((this.angs / (gaji + honor)) * 100, 2);
      this.persenGaji = isNaN(this.persenGaji) ? 0 : this.persenGaji;
      this.persenGajiHonor = roundTo((this.angs / gaji) * 100, 2);
      this.persenGajiHonor = isNaN(this.persenGajiHonor)
        ? 0
        : this.persenGajiHonor;
    }
  }

  btnDisabled() {
    return (
      this.tglLhr == "" ||
      this.umurPensiun <= 0 ||
      (this.gaji == 0 || this.gaji == null) ||
      this.persenGaji <= 0 ||
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

  overGaji() {
    return this.gaji - this.angs > 0 && this.gaji - this.angs <= 150000
      ? "danger"
      : this.gaji - this.angs > 150000 && this.gaji - this.angs < 300000
      ? "warning"
      : "success";
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
