"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var intentSentenceSchema = new mongoose.Schema({
    idIntent: mongoose.Schema.Types.ObjectId,
    idUser: mongoose.Schema.Types.ObjectId,
    desSentence: String,
    dtInsert: Date
});
var intentSentence = mongoose.model('Sentence', intentSentenceSchema);
exports["default"] = intentSentence;
