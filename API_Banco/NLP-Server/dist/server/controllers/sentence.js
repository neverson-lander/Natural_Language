"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sentence_1 = require("../models/sentence");
var base_1 = require("./base");
var SentenceCtrl = (function (_super) {
    __extends(SentenceCtrl, _super);
    function SentenceCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = sentence_1["default"];
        //Get classify by user
        _this.getSentenceByIntent = function (req, res) {
            //console.log(req.params.id);
            _this.model.find({ idIntent: req.params.id }, function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        return _this;
    }
    return SentenceCtrl;
}(base_1["default"]));
exports["default"] = SentenceCtrl;
