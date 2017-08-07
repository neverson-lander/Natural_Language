import * as mongoose from 'mongoose';

const intentSentenceSchema = new mongoose.Schema({
    idIntent: mongoose.Schema.Types.ObjectId,
    idUser: mongoose.Schema.Types.ObjectId,
    desSentence: String,
    dtInsert: Date
});

const intentSentence = mongoose.model('Sentence', intentSentenceSchema);

export default intentSentence;
