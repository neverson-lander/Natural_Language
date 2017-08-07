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
var classify_1 = require("../models/classify");
var jwt = require("jsonwebtoken");
var base_1 = require("./base");
var PythonShell = require("python-shell");
var ClassifyCtrl = (function (_super) {
    __extends(ClassifyCtrl, _super);
    function ClassifyCtrl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = classify_1["default"];
        //Get classify by user
        _this.getClassifyByUser = function (req, res) {
            //console.log(req.params.id);
            _this.model.find({ idUser: req.params.id }, function (err, docs) {
                if (err) {
                    return console.error(err);
                }
                res.json(docs);
            });
        };
        // Insert
        _this.insertClassify = function (req, res) {
            var token = jwt.sign({ classifyToken: req.body.classifyName }, "secrettoken");
            req.body.classifyToken = token;
            //console.log(req.body);
            var obj = new _this.model(req.body);
            obj.save(function (err, item) {
                if (err && err.code === 11000) {
                    res.sendStatus(400);
                }
                if (err) {
                    return console.error(err);
                }
                res.status(200).json(item);
            });
        };
        //Start training
        _this.getTrainByToken = function (req, res) {
            console.log(req.params.classifyToken);
            var token = req.params.classifyToken;
            var myPythonScriptPath = 'Neural_Network_Trainer.py';
            var options = {
                mode: 'text',
                scriptPath: '../../../../../Empresa/Natural_Language/Trainer',
                args: [token]
            };
            var pyshell = new PythonShell(myPythonScriptPath, options);
            pyshell.send(JSON.stringify(token));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                console.log(message);
            });
            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    console.log('Ocorreu um erro durante o treinamento!');
                    res.json('Ocorreu um erro durante o treinamento!');
                    //throw err;
                }
                ;
                res.json('Finalizou');
            });
        };
        //Get classify by sentence
        _this.getClassifyBySentence = function (req, res) {
            //console.log(req.body.classifyToken);
            //console.log(req.body.desSentence);
            var token = req.body.classifyToken;
            var sentence = req.body.desSentence;
            var args = [token, sentence];
            var myPythonScriptPath = 'Neural_Network_Classifier.py';
            var resultado;
            var options = {
                mode: 'text',
                scriptPath: '../../../../../Empresa/Natural_Language/Classifier',
                args: [token, sentence]
            };
            var pyshell = new PythonShell(myPythonScriptPath, options);
            pyshell.send(JSON.stringify(args));
            pyshell.on('message', function (message) {
                // received a message sent from the Python script (a simple "print" statement)
                //console.log(message);
                resultado = message;
            });
            // end the input stream and allow the process to exit
            pyshell.end(function (err) {
                if (err) {
                    console.log('Ocorreu um erro durante a classificação!');
                    res.json('Ocorreu um erro durante a classificação!');
                    //throw err;
                }
                ;
                console.log(resultado);
                res.send(resultado);
            });
        };
        return _this;
    }
    return ClassifyCtrl;
}(base_1["default"]));
exports["default"] = ClassifyCtrl;
