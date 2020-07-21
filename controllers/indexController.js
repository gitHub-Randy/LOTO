let fs = require("fs");
let XLSX = require("xlsx");
let Row = require("../models/row");
const Excel = require("exceljs");
const { isBuffer } = require("util");

module.exports = {
  read(req, res) {
    Row.find().then((rows) => {
      let formattedData = rows;
      sess = req.session;
      if (sess.user) {
        console.log("USEEEEEEEEEEEEEEER");
        console.log(sess.user);
        return res.render("pages/sheet/list.ejs", {
          data: formattedData,
          user: sess.user,
        });
      }
      return res.render("pages/sheet/list.ejs", {
        data: formattedData,
      });
    });
  },

  editRow(req, res) {
    Row.findOne({ nr: req.params.nr }).then((row) => {
      var date = row.datum;
      var newdate = date.split("/").reverse().join("-");
      row.datum = newdate;

      return res.render("pages/sheet/update-row.ejs", {
        data: row,
      });
    });
  },

  add(req, res) {
    Row.find().then((rows) => {
      let numbers = [];

      rows.forEach((row) => {
        numbers.push(row.nr);
      });
      if (numbers.length == 0) {
        numbers.push(0);
      }
      numbers.sort((a, b) => a - b);
      let lastNum = numbers[numbers.length - 1];
      let newNum = Number(lastNum) + Number(1);

      return res.render("pages/sheet/add-row.ejs", {
        nr: newNum,
      });
    });
  },

  create(req, res) {
    console.log(req.body);
    let row = new Row({
      nr: req.body.nr,
      datum: req.body.date.toString().split("-").reverse().join("/"),
      naam: req.body.name,
      object: req.body.object,
      reden: req.body.reason,
      datum_weg: "",
      naam_weg: "",
      spanning: req.body.spanning,
      definitief: false,
    });
    row.save().then((row) => {
      return res.redirect("/spanning");
    });
  },

  export(req, res) {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Blad1");
    const worksheet = workbook.getWorksheet("Blad1");

    worksheet.columns = [
      { header: "Nr", key: "nr", width: 5 },
      { header: "Datum", key: "date", width: 15 },
      { header: "Naam", key: "name", width: 15 },
      { header: "Object", key: "object", width: 15 },
      { header: "Reden", key: "reason", width: 25 },
      { header: "Datum Weg", key: "date_away", width: 15 },
      { header: "Naam Weg", key: "name_away", width: 15 },
      { header: "Spanning", key: "spanning", width: 10 },
    ];
    Row.find()
      .then((rows) => {
        rows.forEach((row, index) => {
          let newIndex = index + 65;
          worksheet.addRow({
            nr: row.nr,
            date: row.datum,
            name: row.naam,
            object: row.object,
            reason: row.reden,
            date_away: row.datum_weg,
            name_away: row.naam_weg,
            spanning: row.spanning,
          });

          // left aligmnet for each column
          for (let i = 65; i <= 72; i++) {
            let colChar = String.fromCharCode(i);
            let colString = colChar;
            console.log(colString);
            worksheet.getColumn(colString).alignment = {
              horizontal: "left",
              vertical: "top",
            };
          }
        });
        // sets auto width of column
        worksheet.columns.forEach(function (column) {
          var dataMax = 0;
          column.eachCell({ includeEmpty: false }, function (cell) {
            if (cell.value != null && cell.value != "") {
              var columnLength = cell.value.length;
              if (columnLength > dataMax) {
                dataMax = columnLength + 1;
              }
            }
          });
          column.width = dataMax < 15 ? 15 : dataMax;
        });

        // make base borders
        worksheet.columns.forEach((column) => {
          column.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thick" },
              bottom: { style: "thin" },
              right: { style: "thick" },
            };
          });
        });

        // make header borders and make bold
        for (let i = 65; i <= 72; i++) {
          let colChar = String.fromCharCode(i);
          let celString = "" + colChar + "1";
          worksheet.getCell(celString).border = {
            top: { style: "thick" },
            bottom: { style: "thick" },
            left: { style: "thick" },
            right: { style: "thick" },
          };
          worksheet.getCell(celString).font = {
            bold: true,
          };
          worksheet.getColumn("nr").font = {
            bold: true
          }
        }

        // make spanning green(yes) or yellow(no)
        worksheet
          .getColumn("spanning")
          .eachCell({ includeEmpty: false }, (cell) => {
            if (cell.value == "Ja") {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFfffb00" },
              };
            } else if (cell.value == "Nee") {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF17ab00" },
              };
            }
          });
      })
      .then(async () => {
        const file = `LOTOLog.xlsx`;
        await workbook.xlsx.writeFile(file);
        res.download(file);
      });
  },

  update(req, res) {
    console.log(req.body);
    Row.findOne({ nr: req.body.nr }).then((row) => {
      if (req.body.date) {
        row.datum = req.body.date.toString().split("-").reverse().join("/");
      }
      if (req.body.name) {
        row.naam = req.body.name;
      }
      if (req.body.object) {
        row.object = req.body.object;
      }
      if (req.body.reason) {
        row.reden = req.body.reason;
      }
      if (req.body.date_away) {
        row.datum_weg = req.body.date_away
          .toString()
          .split("-")
          .reverse()
          .join("/");
      }
      if (req.body.name_away) {
        row.naam_weg = req.body.name_away;
      }
      row.spanning = req.body.spanning;
      row.save().then(() => {
        res.redirect("/spanning");
      });
    });
  },
};
