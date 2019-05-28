import {
  potongan,
  asuransi,
  calcAskrida,
  calcTaspen,
  RATE,
  calcAskrindo,
  calcAvrist
} from "./../shared/model";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";
import { ModalController, NavParams, ToastController } from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { sbKrd } from "../shared";
import { File } from "@ionic-native/file/ngx";
import * as moment from "moment";
import domToImg from "dom-to-image";
declare var require: any;
const roundTo = require("round-to");

@Component({
  selector: "app-modal-result",
  templateUrl: "./modal-result.component.html",
  styleUrls: ["./modal-result.component.scss"]
})
export class ModalResultComponent implements OnInit {
  @Input() jns: string;
  @Input() plafon: number;
  @Input() jw: number;
  @Input() gaji: number;
  @Input() honor: number;
  @Input() angs: number;
  @Input() sb: sbKrd;
  @Input() tglMulai: string;
  @Input() tglLhr: string;
  @Input() umurPensiun: number;
  @Input() pelunasan: number;
  @Input() jnsAss: string;
  @Input() nama: string;
  umur: number;
  tglJt: string;
  tblBiaya = potongan.init();
  provisi: number;
  adm: number;
  sbEff: number;
  asuransi: number = 0;
  dispShare = false;
  nodeShare: any;
  angsMaju: number = 0;
  @ViewChild("result") divResult: ElementRef;

  constructor(
    private view: ModalController,
    navParams: NavParams,
    private socialSharing: SocialSharing,
    private cdRef: ChangeDetectorRef,
    private file: File,
    private toastCtrl: ToastController
  ) {
    const tglLhr = navParams.data["tglLhr"];
    const tglMulai = navParams.data["tglMulai"];
    const jw = navParams.data["jw"];
    this.umur = moment(new Date(tglMulai)).diff(
      moment(new Date(tglLhr)),
      "years"
    );
    this.tglJt = moment(new Date(tglMulai))
      .add(jw, "months")
      .toISOString();
  }

  ngOnInit() {
    if (this.jnsAss == "askrida")
      this.asuransi = calcAskrida(
        this.tglLhr,
        this.tglMulai,
        this.jw,
        this.umur,
        this.plafon
      );
    if (this.jnsAss == "taspen")
      this.asuransi = calcTaspen(
        this.tglLhr,
        this.tglMulai,
        this.jw,
        this.umur,
        this.plafon
      );
    if (this.jnsAss == "askrindo")
      this.asuransi = calcAskrindo(this.umur, this.jw, this.plafon);
    if (this.jnsAss == "avrist")
      this.asuransi = calcAvrist(
        this.tglLhr,
        this.tglMulai,
        this.jw,
        this.umur,
        this.plafon
      );
    let pot = this.tblBiaya.find(f => f.jnsKrd == this.jns);
    this.provisi = pot.provPersen ? (this.plafon * pot.prov) / 100 : pot.prov;
    this.adm = pot.admPersen ? (this.plafon * pot.adm) / 100 : pot.adm;
    this.sbEff = roundTo(RATE(this.jw, -this.angs, this.plafon) * 12 * 100, 2);
    this.angsMaju =
      moment(new Date(this.tglMulai)).date() >= 20 ? this.angs : 0;
  }

  share() {
    this.dispShare = true;
    this.cdRef.detectChanges();
    this.nodeShare = document.getElementById("result");
    domToImg.toBlob(this.nodeShare, { height: 1650, width: 720 }).then(blob => {
      this.dispShare = false;
      this.saveImg(blob);
      this.blobToDataUrl(blob, imgUrl => {
        const subject = "Simulasi Kredit " + this.nama;
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
    const dirName = "Simulasi Kredit";
    const rootDir = this.file.externalRootDirectory;
    const fileDir = rootDir + dirName;
    const fileName = moment().format("YYYYMMDDHHmmss") + ".jpeg";
    this.file
      .createDir(rootDir, "Simulasi Kredit", false)
      .then(dirEntry => {})
      .then(_ => {
        this.file
          .writeFile(fileDir, fileName, blob)
          .then(result => this.showMessage("Simulasi disimpan!"))
          .catch(err => this.showMessage("Error : " + err.message));
      });

    this.file.checkDir(rootDir, dirName).then(
      found => {
        this.file
          .writeFile(fileDir, fileName, blob)
          .then(result => this.showMessage("Simulasi disimpan!"))
          .catch(err => this.showMessage("Error : " + err.message));
      },
      err => {
        this.showMessage("Error: " + err.message);
      }
    );
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
