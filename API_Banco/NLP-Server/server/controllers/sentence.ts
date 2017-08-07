import Sentence from '../models/sentence';
import * as jwt from 'jsonwebtoken';
import BaseCtrl from './base';

export default class SentenceCtrl extends BaseCtrl {
  model = Sentence;

  //Get classify by user
  getSentenceByIntent = (req, res) => {
  //console.log(req.params.id);
    this.model.find({ idIntent: req.params.id }, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  };
}
