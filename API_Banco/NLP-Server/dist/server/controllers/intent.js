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
var intent_1 = require("../models/intent");
var base_1 = require("./base");
var IntentCtrl = (function (_super) {
    __extends(IntentCtrl, _super);
    function IntentCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = intent_1["default"];
        //Get intents by classify
        _this.getIntentByClassify = function (req, res) {
            console.log(req.params.id);
            _this.model.find({ idClassify: req.params.id }, function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        return _this;
    }
    return IntentCtrl;
}(base_1["default"]));
exports["default"] = IntentCtrl;
