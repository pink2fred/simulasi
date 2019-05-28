create table if not exists sbLoan(jenis integer, jw integer,sb decimal(5,2), sbBln decimal(5,2), primary key (jenis,jw));
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(1, 71, 8.4, 0.7);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(1, 131, 9, 0.75);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(1, 191, 9.6, 0.8);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(1, 240, 10.2, 0.85);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(2, 71, 9.6, 0.8);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(2, 131, 10.2, 0.85);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(2, 191, 10.56, 0.88);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(2, 240, 10.8, 0.9);

-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(1, 0, null, null);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(2, 0, null, null);
-- insert or ignore into sbLoan(jenis,jw,sb,sbBln) values(3, 0, null, null);

create table if not exists sbDepo(jw integer, nominal numeric(15,2),sb decimal(5,2), sbBln decimal(5,2), primary key (jw,nominal));
-- insert or ignore into sbDepo(jw,nominal,sb,sbBln) values(1, 0, null, null);
-- insert or ignore into sbDepo(jw,nominal,sb,sbBln) values(3, 0, null, null);
-- insert or ignore into sbDepo(jw,nominal,sb,sbBln) values(6, 0, null, null);

create table if not exists sbTab(jenis integer, nominal numeric(15,2),sb decimal(5,2), sbBln decimal(5,2), primary key (jenis,nominal));
-- insert or ignore into sbTab(jenis,nominal,sb,sbBln) values(1, 0, null, null);
-- insert or ignore into sbTab(jenis,nominal,sb,sbBln) values(2, 0, null, null);
-- insert or ignore into sbTab(jenis,nominal,sb,sbBln) values(3, 0, null, null);

create table if not exists histKrd(id integer primary key autoincrement,jenis integer, nama char(100),tglLhr datetime, gaji numeric(10,2), honor numeric(10,2), 
    umurPensiun integer, jw integer, plafon numeric(15,2), lunas numeric(15,2), jnsAss char(10), inpDate datetime);
create table if not exists histDepo(id integer primary key autoincrement,jw integer, nama char(100), nominal numeric(15,2), sb decimal(5,2), addon decimal(5,2), pajak bit, inpDate datetime);
