"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var classifySchema = new mongoose.Schema({
    classifyName: String,
    desClassify: String,
    classifyToken: String,
    idUser: mongoose.Schema.Types.ObjectId,
    dtInsert: Date,
    dtUpdate: Date
});
var Classify = mongoose.model('Classify', classifySchema);
exports["default"] = Classify;
