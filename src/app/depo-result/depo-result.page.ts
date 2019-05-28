import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from "@angular/core";
import { sbDepo } from "../shared";
import { ModalController, NavParams, ToastController } from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { File } from "@ionic-native/file/ngx";
import * as moment from "moment";
import domToImg from "dom-to-image";
declare var require: any;
declare var window: any;
const roundTo = require("round-to");

@Component({
  selector: "app-depo-result",
  templateUrl: "./depo-result.page.html",
  styleUrls: ["./depo-result.page.scss"]
})
export class DepoResultPage implements OnInit {
  constructor(
    private view: ModalController,
    private navParams: NavParams,
    private socialSharing: SocialSharing,
    private cdRef: ChangeDetectorRef,
    private file: File,
    private toastCtrl: ToastController
  ) {
    const tglMulai = navParams.data["tglMulai"];
    const jw = navParams.data["jw"];
    this.tglJt = moment(new Date(tglMulai))
      .add(jw, "months")
      .toISOString();
  }
  @Input() nama: string;
  @Input() nominal: number;
  @Input() jw: number;
  @Input() sb: sbDepo;
  @Input() addon: number;
  @Input() pajak: number;
  @Input() tglMulai: Date;
  tglJt: string;
  totBunga: number = 0;
  totPajak: number = 0;
  resultBunga: { tgl: Date; hari: number; bunga: number; pajak: number }[] = [];

  dispShare = false;
  nodeShare: any;
  @ViewChild("result") divResult: ElementRef;
  err;

  async;
  ngOnInit() {
    let tglBef = moment(this.tglMulai);
    for (let i = 1; i <= this.jw; i++) {
      const tglBng = moment(this.tglMulai).add(i, "months");
      const jmlHari = moment(tglBng).diff(moment(tglBef), "days");
      const totBunga = roundTo(
        (this.nominal * ((this.sb.sb + this.addon) / 100) * jmlHari) / 365,
        0
      );
      this.totBunga += totBunga;
      this.resultBunga.push({
        tgl: new Date(tglBng.toISOString()),
        hari: jmlHari,
        bunga: totBunga,
        pajak: (totBunga * this.pajak) / 100
      });
      tglBef = tglBng;
    }
    this.totPajak = (this.totBunga * this.pajak) / 100;
  }

  share() {
    this.showMessage("Simulasi disimpan!");
    this.dispShare = true;
    this.cdRef.detectChanges();
    this.nodeShare = document.getElementById("result");
    domToImg.toBlob(this.nodeShare, { height: 1024, width: 720 }).then(blob => {
      this.dispShare = false;
      this.saveImg(blob);
      this.blobToDataUrl(blob, imgUrl => {
        const subject = "Simulasi Deposito " + this.nama.toUpperCase();
        this.socialSharing.share(null, subject, imgUrl);
      });
    });
  }

  blobToDataUrl(blob, callback) {
    let reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(blob);
  }

  saveImg(blob) {
    const dirName = "Simulasi Deposito";
    const rootDir = this.file.externalRootDirectory;
    const fileDir = rootDir + dirName;
    const fileName = moment().format("YYYYMMDDHHmmss") + ".jpeg";
    this.file
      .createDir(rootDir, "Simulasi Deposito", false)
      .then(dirEntry => {})
      .then(_ => {
        this.file
          .writeFile(fileDir, fileName, blob)
          .then(result => this.showMessage("Simulasi disimpan!"))
          .catch(err => this.showMessage("Error : " + err.message));
      });

    this.file.checkDir(rootDir, dirName).then(found => {
      this.file
        .writeFile(fileDir, fileName, blob)
        .then(result => this.showMessage("Simulasi disimpan!"))
        .catch(err => this.showMessage("Error : " + err.message));
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

  closeModal() {
    this.view.dismiss();
  }
}
