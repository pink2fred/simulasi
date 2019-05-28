import { IhistSimKrd } from "./../shared/model";
import { Component, OnInit, Input } from "@angular/core";
import { DbService } from "../shared/db.service";
import { Observable } from "rxjs";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-hist-krd",
  templateUrl: "./hist-krd.page.html",
  styleUrls: ["./hist-krd.page.scss"]
})
export class HistKrdPage implements OnInit {
  @Input() jenis: number;
  histLoans: Observable<IhistSimKrd[]> = new Observable<[]>();

  constructor(private db: DbService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.loadHistLoan("jenis = ?", [this.jenis]);
        this.histLoans = this.db.getHistLoans();
      }
    });
  }

  delete(id) {
    this.db.delHistLoan("id = ?", [id]).then(_ => {
      this.db.loadHistLoan("jenis = ?", [this.jenis]);
      this.histLoans = this.db.getHistLoans();
    });
  }

  pilih(item: IhistSimKrd) {
    this.modalCtrl.dismiss(item);
  }
}
