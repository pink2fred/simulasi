import { Injectable } from "@angular/core";
import { SQLiteObject, SQLite } from "@ionic-native/sqlite/ngx";
import { BehaviorSubject, Observable } from "rxjs";
import { Platform, LoadingController } from "@ionic/angular";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { HttpClient } from "@angular/common/http";
import {
  IsbLoan,
  IsbDepo,
  IhistSimKrd,
  IhistSimDepo,
  convertDate
} from "./model";
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class DbService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  sbLoans = new BehaviorSubject([]);
  sbDepos = new BehaviorSubject([]);
  histLoans = new BehaviorSubject([]);
  histDepos = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    public loadingCtrl: LoadingController,
    private http: HttpClient
  ) {
    this.plt.ready().then(() => {
      this.sqlite
        .create({
          name: "bpr.db",
          location: "default"
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    });
  }

  seedDatabase() {
    this.http
      .get("assets/seed.sql", { responseType: "text" })
      .subscribe(sql => {
        this.sqlitePorter
          .importSqlToDb(this.database, sql)
          .then(_ => {
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getSbLoans(): Observable<IsbLoan[]> {
    return this.sbLoans.asObservable();
  }

  getSbDepos(): Observable<IsbDepo[]> {
    return this.sbDepos.asObservable();
  }

  getHistLoans(): Observable<IhistSimKrd[]> {
    return this.histLoans.asObservable();
  }

  getHistDepos(): Observable<IhistSimDepo[]> {
    return this.histDepos.asObservable();
  }

  // CRUD sbLoan
  loadSbLoan() {
    return this.database.executeSql("SELECT * FROM sbLoan", []).then(data => {
      let datas: IsbLoan[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          datas.push({
            jenis: data.rows.item(i).jenis,
            jw: data.rows.item(i).jw,
            sb: data.rows.item(i).sb,
            sbBln: data.rows.item(i).sbBln
          });
        }
      }
      this.sbLoans.next(datas);
    });
  }

  existSbKrd(jenis) {
    return this.database
      .executeSql("SELECT * FROM sbLoan where jenis = ?", [jenis])
      .then(data => (data.rows.length == 0 ? false : true));
  }

  addSbLoan(val: IsbLoan) {
    let row = [val.jenis, val.jw, val.sb, val.sbBln];
    return this.database
      .executeSql(
        "INSERT INTO sbLoan (jenis, jw, sb, sbBln) VALUES (?, ?, ?, ?)",
        row
      )
      .then(data => {
        this.loadSbLoan();
      });
  }

  getSbLoan(jenis, jw): Promise<IsbLoan> {
    return this.database
      .executeSql("SELECT * FROM sbLoan WHERE jenis = ? and jw = ?", [
        jenis,
        jw
      ])
      .then(data => {
        return {
          jenis: data.rows.item(0).jenis,
          jw: data.rows.item(0).jw,
          sb: data.rows.item(0).sb,
          sbBln: data.rows.item(0).sbBln
        };
      });
  }

  deleteSbLoan(jenis) {
    return this.database
      .executeSql("DELETE FROM sbLoan WHERE jenis = ?", [jenis])
      .then(_ => {
        this.loadSbLoan();
      });
  }

  updateSbLoan(val: IsbLoan) {
    let row = [val.jenis, val.jw, val.sb, val.sbBln];
    return this.database
      .executeSql(
        `UPDATE sbLoan SET jw = ?, sb = ?, sbBln = ? WHERE jenis = ${
          val.jenis
        }`,
        row
      )
      .then(data => {
        this.loadSbLoan();
      });
  }

  // CRUD sbDepo
  loadSbDepo() {
    return this.database.executeSql("SELECT * FROM sbDepo", []).then(data => {
      let datas: IsbDepo[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          datas.push({
            nominal: data.rows.item(i).nominal,
            jw: data.rows.item(i).jw,
            sb: data.rows.item(i).sb,
            sbBln: data.rows.item(i).sbBln
          });
        }
      }
      this.sbDepos.next(datas);
    });
  }

  existSbDepo(jw) {
    return this.database
      .executeSql("SELECT * FROM sbDepo where jw = ?", [jw])
      .then(data => (data.rows.length == 0 ? false : true));
  }

  addSbDepo(val: IsbDepo) {
    let row = [val.jw, val.nominal, val.sb, val.sbBln];
    return this.database
      .executeSql(
        "INSERT INTO sbDepo (jw, nominal, sb, sbBln) VALUES (?, ?, ?, ?)",
        row
      )
      .then(data => {
        this.loadSbDepo();
      });
  }

  deleteSbDepo(jw) {
    return this.database
      .executeSql("DELETE FROM sbDepo WHERE jw = ?", [jw])
      .then(_ => {
        this.loadSbDepo();
      });
  }

  // CRUD histLoan
  loadHistLoan(where: string, params: any[] = []) {
    return this.database
      .executeSql(
        "SELECT * FROM histKrd" +
          (where == "" ? "" : " where " + where) +
          " order by inpDate desc",
        params
      )
      .then(data => {
        let datas: IhistSimKrd[] = [];

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            datas.push({
              id: data.rows.item(i).id,
              jenis: data.rows.item(i).jenis,
              nama: data.rows.item(i).nama,
              tglLhr: data.rows.item(i).tglLhr,
              gaji: data.rows.item(i).gaji,
              honor: data.rows.item(i).honor,
              umurPensiun: data.rows.item(i).umurPensiun,
              jw: data.rows.item(i).jw,
              plafon: data.rows.item(i).plafon,
              lunas: data.rows.item(i).lunas,
              jnsAss: data.rows.item(i).jnsAss,
              inpDate: data.rows.item(i).inpDate
            });
          }
        }
        this.histLoans.next(datas);
      });
  }

  addHistLoan(val: IhistSimKrd) {
    let row = [
      val.jenis,
      val.nama,
      convertDate(val.tglLhr, true),
      val.gaji,
      val.honor,
      val.umurPensiun,
      val.jw,
      val.plafon,
      val.lunas,
      val.jnsAss,
      moment().format("YYYY-MM-DD HH:mm:ss")
    ];
    return this.database
      .executeSql(
        "INSERT INTO histKrd (jenis, nama, tglLhr, gaji, honor, umurPensiun, jw, plafon, lunas, jnsAss, inpDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        row
      )
      .then(data => {
        this.loadHistDepo();
      });
  }

  delHistLoan(where: string, params: any[] = []) {
    return this.database
      .executeSql(
        "delete from histKrd " + (where == "" ? "" : "where " + where),
        params
      )
      .then(_ => {
        this.loadHistDepo();
      });
  }

  // CRUD histDepo
  loadHistDepo() {
    return this.database
      .executeSql("SELECT * FROM histDepo order by inpDate desc", [])
      .then(data => {
        let datas: IhistSimDepo[] = [];

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            datas.push({
              id: data.rows.item(i).id,
              jw: data.rows.item(i).jw,
              nama: data.rows.item(i).nama,
              nominal: data.rows.item(i).nominal,
              sb: data.rows.item(i).sb,
              addon: data.rows.item(i).addon,
              pajak: data.rows.item(i).pajak,
              inpDate: data.rows.item(i).inpDate
            });
          }
        }
        this.histDepos.next(datas);
      });
  }

  addHistDepo(val: IhistSimDepo) {
    let row = [
      val.jw,
      val.nama,
      val.nominal,
      val.sb,
      val.addon,
      val.pajak,
      moment().format("YYYY-MM-DD HH:mm:ss")
    ];
    return this.database
      .executeSql(
        "INSERT INTO histDepo (jw, nama, nominal, sb, addon, pajak, inpDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
        row
      )
      .then(data => {
        this.loadHistDepo();
      });
  }

  delHistDepo(where: string, params: any[] = []) {
    let sql = "DELETE FROM histDepo " + (where == "" ? "" : "WHERE " + where);
    return this.database.executeSql(sql, params).then(_ => {
      this.loadHistDepo();
    });
  }
}
