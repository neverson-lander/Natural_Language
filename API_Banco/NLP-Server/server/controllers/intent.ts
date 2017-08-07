import Intent from '../models/intent';
import BaseCtrl from './base';

export default class IntentCtrl extends BaseCtrl {
  model = Intent;

  //Get intents by classify
  getIntentByClassify = (req, res) => {
  console.log(req.params.id);
    this.model.find({ idClassify: req.params.id }, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  };
}
