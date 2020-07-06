let fs = require("fs");
let XLSX = require("xlsx");
let moment = require("moment");
const { type } = require("os");
module.exports = {
  read(req, res) {
    var wb = XLSX.readFile(`${__dirname}/LOTOLog.xlsx`, {
      type: "array",
      cellDates: true,
      dateNF: "DD-MM-YYYY",
    });
    var ws = wb.Sheets[wb.SheetNames[0]];
    let jsonData = XLSX.utils.sheet_to_json(ws);
    let formattedData = [];
    jsonData.forEach((element) => {
      formattedData.push(element);
      element.Datum = moment(element.Datum.toString()).format("DD/MM/YYYY");
      if (element.datum_weg.length != "") {
        element.datum_weg = moment(element.datum_weg.toString()).format(
          "DD/MM/YYYY"
        );
      }
    });

    return res.render("pages/sheet/list.ejs", {
      data: formattedData,
    });
  },

  add(req, res) {
    var wb = XLSX.readFile(`${__dirname}/LOTOLog.xlsx`);
    var ws = wb.Sheets[wb.SheetNames[0]];
    let jsonData = XLSX.utils.sheet_to_json(ws);
    let numbers = [];
    jsonData.forEach((element) => {
      console.log(element);
      numbers.push(element.Nr);
    });
      numbers.sort((a, b) => a - b);
      let lastNum = numbers[numbers.length - 1];
      let newNum = Number(lastNum) + Number(1);
      
    return res.render("pages/sheet/add-row.ejs", {
      nr: newNum,
    });
  },

  create(req, res) {
    console.log(req.body);
    var wb = XLSX.readFile(`${__dirname}/LOTOLog.xlsx`, {
      type: "array",
      cellDates: true,
      dateNF: "DD-MM-YYYY",
    });

    var ws = wb.Sheets[wb.SheetNames[0]];
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          req.body.nr,
          req.body.date.toString().split("-").reverse().join("/"),
          req.body.name,
          req.body.object,
          req.body.reason,
          "",
          "",
          "Nee",
        ],
      ],
      { origin: -1 }
    );
    XLSX.writeFile(wb, `${__dirname}/LOTOLog.xlsx`, { dateNF: "DD-MM-YYYY" });
  },

  edit(req, res) {
    console.log("EDIT");
  },

  update(req, res) {
    console.log(req.body);

    var wb = XLSX.readFile(`${__dirname}/LOTOLog.xlsx`);
    var ws = wb.Sheets[wb.SheetNames[0]];

    let jsonData = XLSX.utils.sheet_to_json(ws);
      console.log(jsonData)
      jsonData.forEach(element => {
          if (element.Nr == req.body.nr) {
              if (req.body.date_away) { 
                element.datum_weg = req.body.date_away;

              }
              if (req.body.name_away) { 
                element.Name_weg = req.body.name_away;

              }
              element.Spanning = req.body.spanning;
          }
      })
      var wbNew = XLSX.utils.book_new();
      var wsNew = XLSX.utils.json_to_sheet(jsonData);
      XLSX.utils.book_append_sheet(wbNew, wsNew, "Blad1");
      XLSX.writeFile(wbNew, `${__dirname}/LOTOLog.xlsx`, { dateNF: "DD-MM-YYYY" });
  },
};
