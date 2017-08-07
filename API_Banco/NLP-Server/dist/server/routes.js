"use strict";
exports.__esModule = true;
var express = require("express");
var classify_1 = require("./controllers/classify");
var intent_1 = require("./controllers/intent");
var user_1 = require("./controllers/user");
var sentence_1 = require("./controllers/sentence");
function setRoutes(app) {
    var router = express.Router();
    var classifyCtrl = new classify_1["default"]();
    var intentCtrl = new intent_1["default"]();
    var sentenceCtrl = new sentence_1["default"]();
    var userCtrl = new user_1["default"]();
    // Classify
    router.route('/classifies').get(classifyCtrl.getAll);
    router.route('/classifies/count').get(classifyCtrl.count);
    router.route('/classify').post(classifyCtrl.insertClassify);
    router.route('/classify/:id').get(classifyCtrl.get);
    router.route('/classifies/user/:id').get(classifyCtrl.getClassifyByUser);
    router.route('/classify/:id').put(classifyCtrl.update);
    router.route('/classify/:id')["delete"](classifyCtrl["delete"]);
    router.route('/classifies/train/:classifyToken').get(classifyCtrl.getTrainByToken);
    router.route('/classify/classify').post(classifyCtrl.getClassifyBySentence);
    // Intents
    router.route('/intents').get(intentCtrl.getAll);
    router.route('/intents/count').get(intentCtrl.count);
    router.route('/intent').post(intentCtrl.insert);
    router.route('/intent/:id').get(intentCtrl.get);
    router.route('/intents/classify/:id').get(intentCtrl.getIntentByClassify);
    router.route('/intent/:id').put(intentCtrl.update);
    router.route('/intent/:id')["delete"](intentCtrl["delete"]);
    // Sentence
    router.route('/sentences').get(sentenceCtrl.getAll);
    router.route('/sentences/count').get(sentenceCtrl.count);
    router.route('/sentence').post(sentenceCtrl.insert);
    router.route('/sentence/:id').get(sentenceCtrl.get);
    router.route('/sentences/intent/:id').get(sentenceCtrl.getSentenceByIntent);
    router.route('/sentence/:id').put(sentenceCtrl.update);
    router.route('/sentence/:id')["delete"](sentenceCtrl["delete"]);
    // Users
    router.route('/login').post(userCtrl.login);
    router.route('/users').get(userCtrl.getAll);
    router.route('/users/count').get(userCtrl.count);
    router.route('/user').post(userCtrl.insert);
    router.route('/user/:id').get(userCtrl.get);
    router.route('/user/:id').put(userCtrl.update);
    router.route('/user/:id')["delete"](userCtrl["delete"]);
    // Apply the routes to our application with the prefix /api
    app.use('/api', router);
}
exports["default"] = setRoutes;
