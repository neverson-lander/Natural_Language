import Classify from '../models/classify';
import * as jwt from 'jsonwebtoken';
import BaseCtrl from './base';
import * as PythonShell from 'python-shell';

export default class ClassifyCtrl extends BaseCtrl {
  model = Classify;

  //Get classify by user
  getClassifyByUser = (req, res) => {
  //console.log(req.params.id);
    this.model.find({ idUser: req.params.id }, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  };

  // Insert
  insertClassify = (req, res) => {
  	const token = jwt.sign({ classifyToken: req.body.classifyName }, "secrettoken");
  	req.body.classifyToken = token;
  	//console.log(req.body);
    const obj = new this.model(req.body);
    obj.save((err, item) => {

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
  getTrainByToken = (req, res) => {
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
        if (err){
          console.log('Ocorreu um erro durante o treinamento!');
          res.json('Ocorreu um erro durante o treinamento!')
            //throw err;
        };
        res.json('Finalizou');
    });

  };


  //Get classify by sentence
  getClassifyBySentence = (req, res) => {
    //console.log(req.body.classifyToken);
    //console.log(req.body.desSentence);
    var token = req.body.classifyToken;
    var sentence = req.body.desSentence;
    var args = [token, sentence]
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
        if (err){
          console.log('Ocorreu um erro durante a classificação!');
          res.json('Ocorreu um erro durante a classificação!')
          //throw err;
        };
        console.log(resultado);
        res.send(resultado);
    });

  };
}
