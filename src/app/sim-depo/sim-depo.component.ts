import { Component, OnInit } from "@angular/core";
import { sbDepo, IhistSimDepo } from "../shared";
import { DbService } from "../shared/db.service";
import {
  ModalController,
  AlertController,
  ToastController
} from "@ionic/angular";
// import { Keyboard } from "@ionic-native/keyboard/ngx";

import * as moment from "moment";
import { CustomCurrencyPipe } from "../shared/currency.pipe";
import { DepoResultPage } from "../depo-result/depo-result.page";
import { HistDepoPage } from "../hist-depo/hist-depo.page";
declare var require: any;
const roundTo = require("round-to");

@Component({
  selector: "app-sim-depo",
  templateUrl: "./sim-depo.component.html",
  styleUrls: ["./sim-depo.component.scss"]
})
export class SimDepoComponent implements OnInit {
  paramSb: sbDepo[]; // = sbDepo.init();
  nama: string = "";
  tglMulai: string = moment().toISOString();
  nominal: number;
  isPajak = true;
  jw: string;
  addon: number = 0;
  sb: sbDepo;

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
        this.db.loadSbDepo();
        this.db.getSbDepos().subscribe(res => {
          this.paramSb = res;
        });
      }
    });
  }

  btnDisabled() {
    return this.nominal == undefined || this.jw == undefined;
  }

  async presentConfirm() {
    const alert = await this.alertCtrl.create({
      header: "Konfirmasi!",
      message:
        "<b>Deposito " +
        this.jw +
        " Bulan</b>" +
        "<br/>Nominal = Rp. " +
        this.currPipe.transform(this.nominal, 0) +
        "<br/>Suku Bunga = " +
        (this.sb.sb + this.addon) +
        "% p.a<br/>Bunga " +
        (this.isPajak ? "" : "tidak ") +
        "dikenakan pajak",
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

  nomChange() {
    this.sb = this.getBunga();
  }

  getBunga() {
    let sb: sbDepo;
    this.paramSb
      .filter(f => f.jw == +this.jw)
      .forEach((val, i, arr) => {
        let nomBef = i <= 0 ? 0 : arr[i - 1].nominal;
        if (this.nominal > nomBef && this.nominal <= val.nominal) sb = val;
      });
    return sb;
  }

  async presentHistory() {
    let modal = await this.modalCtrl.create({
      component: HistDepoPage,
      componentProps: { jenis: 2 }
    });
    modal.onDidDismiss().then(data => {
      if (data.data != undefined) {
        let history = data.data as IhistSimDepo;
        this.nama = history.nama;
        this.jw = history.jw.toString();
        this.nominal = history.nominal;
        const paramSb = this.getBunga();
        if (history.sb != paramSb.sb)
          this.showMessage(
            "Suku bunga (Counter Rate) disesuaikan dengan suku bunga berlaku yaitu " +
              paramSb.sb +
              "% p.a!!! Add On ditiadakan",
            "middle",
            "",
            5000
          );
        this.sb =
          history.sb != paramSb.sb
            ? paramSb
            : new sbDepo(+this.jw, this.nominal, history.sb);
        this.addon = history.sb != paramSb.sb ? 0 : history.addon;
        this.isPajak = history.pajak;
      }
    });
    return await modal.present();
  }

  simpan() {
    this.db
      .addHistDepo({
        id: 0,
        jw: +this.jw,
        nama: this.nama,
        nominal: this.nominal,
        sb: this.sb.sb,
        addon: this.addon,
        pajak: this.isPajak
      })
      .then(_ => this.showMessage("Simulasi telah disimpan ke riwayat..."));
  }

  async hitung() {
    const modal = await this.modalCtrl.create({
      component: DepoResultPage,
      cssClass: "custom-modal-css",
      componentProps: {
        nama: this.nama,
        nominal: this.nominal,
        jw: +this.jw,
        sb: this.sb,
        addon: this.addon,
        pajak: this.isPajak ? 20 : 0,
        tglMulai: new Date(this.tglMulai)
      }
    });
    return await modal.present();
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
