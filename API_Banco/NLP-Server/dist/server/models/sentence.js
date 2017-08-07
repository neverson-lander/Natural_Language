"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var sentenceSchema = new mongoose.Schema({
    desSentence: String,
    idIntent: mongoose.Schema.Types.ObjectId,
    idUser: mongoose.Schema.Types.ObjectId,
    dtInsert: Date,
    dtUpdate: Date
});
var Sentence = mongoose.model('Sentence', sentenceSchema);
exports["default"] = Sentence;
