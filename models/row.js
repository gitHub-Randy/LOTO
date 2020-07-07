const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rowSchema = mongoose.Schema({
    nr: {
        type: Number,
    },
    datum: {
        type: String,
    },
    naam: {
      type: String
    },
    object: {
        type: String

    },
    reden: {
        type: String

    },
    datum_weg: {
        type: String

    },
    naam_weg: {
        type: String

    },
    spanning: {
        type: String

    },
    definitief: {
        type: Boolean
    }
  
});

module.exports = mongoose.model("Row", rowSchema);
