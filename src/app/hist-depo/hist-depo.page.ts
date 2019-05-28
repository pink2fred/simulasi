import { Component, OnInit } from "@angular/core";
import { IhistSimDepo, IhistSimKrd } from "../shared";
import { Observable } from "rxjs";
import { DbService } from "../shared/db.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-hist-depo",
  templateUrl: "./hist-depo.page.html",
  styleUrls: ["./hist-depo.page.scss"]
})
export class HistDepoPage implements OnInit {
  histDepos: Observable<IhistSimDepo[]> = new Observable<[]>();

  constructor(private db: DbService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.loadHistDepo();
        this.histDepos = this.db.getHistDepos();
      }
    });
  }

  delete(id) {
    this.db.delHistDepo("id = ?", [id]).then(_ => {
      this.db.loadHistDepo();
      this.histDepos = this.db.getHistDepos();
    });
  }

  pilih(item: IhistSimDepo) {
    this.modalCtrl.dismiss(item);
  }

  isBoolean(val) {
    return val.toString() === "true" ? true : false;
  }
}
