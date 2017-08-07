import * as express from 'express';

import ClassifyCtrl from './controllers/classify';
import IntentCtrl from './controllers/intent';
import UserCtrl from './controllers/user';
import SentenceCtrl from './controllers/sentence';
import Intent from './models/intent';
import User from './models/user';
import Sentence from './models/sentence';

export default function setRoutes(app) {

  const router = express.Router();

  const classifyCtrl = new ClassifyCtrl();
  const intentCtrl = new IntentCtrl();
  const sentenceCtrl = new SentenceCtrl();
  const userCtrl = new UserCtrl();

   // Classify
  router.route('/classifies').get(classifyCtrl.getAll);
  router.route('/classifies/count').get(classifyCtrl.count);
  router.route('/classify').post(classifyCtrl.insertClassify);
  router.route('/classify/:id').get(classifyCtrl.get);
  router.route('/classifies/user/:id').get(classifyCtrl.getClassifyByUser);
  router.route('/classify/:id').put(classifyCtrl.update);
  router.route('/classify/:id').delete(classifyCtrl.delete);
  router.route('/classifies/train/:classifyToken').get(classifyCtrl.getTrainByToken);
  router.route('/classify/classify').post(classifyCtrl.getClassifyBySentence);
  

  // Intents
  router.route('/intents').get(intentCtrl.getAll);
  router.route('/intents/count').get(intentCtrl.count);
  router.route('/intent').post(intentCtrl.insert);
  router.route('/intent/:id').get(intentCtrl.get);
  router.route('/intents/classify/:id').get(intentCtrl.getIntentByClassify);
  router.route('/intent/:id').put(intentCtrl.update);
  router.route('/intent/:id').delete(intentCtrl.delete);

  // Sentence
  router.route('/sentences').get(sentenceCtrl.getAll);
  router.route('/sentences/count').get(sentenceCtrl.count);
  router.route('/sentence').post(sentenceCtrl.insert);
  router.route('/sentence/:id').get(sentenceCtrl.get);
  router.route('/sentences/intent/:id').get(sentenceCtrl.getSentenceByIntent);
  router.route('/sentence/:id').put(sentenceCtrl.update);
  router.route('/sentence/:id').delete(sentenceCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
