"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var intentSchema = new mongoose.Schema({
    idClassify: mongoose.Schema.Types.ObjectId,
    idUser: mongoose.Schema.Types.ObjectId,
    intentName: String,
    dtInsert: Date,
    dtUpdate: Date
});
var Intent = mongoose.model('Intent', intentSchema);
exports["default"] = Intent;
