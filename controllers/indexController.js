let fs = require("fs");
let XLSX = require("xlsx");
let moment = require("moment");
let Row = require("../models/row");
const row = require("../models/row");
module.exports = {
  
  read(req, res) {
    Row.find().then((rows) => {
      let formattedData = rows;
      console.log(formattedData);
      return res.render("pages/sheet/list.ejs", {
        data: formattedData,
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
    let row = new Row({
      nr: req.body.nr,
      datum: req.body.date.toString().split("-").reverse().join("/"),
      naam: req.body.name,
      object: req.body.object,
      reden: req.body.reason,
      datum_weg: "",
      naam_weg: "",
      spanning: "Nee",
    });
    row.save().then((row) => {
      return res.redirect("/spanning");
    });
  },

  export(req, res) {
    var wb = XLSX.utils.book_new();
    var ws_name = "Blad1";
    let ws_data = []

    Row.find()
      .then((rows) => {

        rows.forEach((row) => {
          ws_data.push({
            Nr: row.nr,
            Datum: row.datum,
            Naam: row.naam,
            Object: row.object,
            Reden: row.reden,
            "Datum weg": row.datum_weg,
            "Naam weg": row.naam_weg,
            Spanning: row.spanning,
          });
        });
        return ws_data;
      })
      .then((ws_data) => {
        console.log(ws_data)
        var ws = XLSX.utils.json_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb, "LOTOLog.xlsx");
      })
      .then(() => {
        const file = `LOTOLog.xlsx`;
        res.download(file); // Set disposition and send it.
      });
  },

  update(req, res) {
    console.log(req.body);
    Row.findOne({ nr: req.body.nr }).then((row) => {
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
