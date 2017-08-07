import * as mongoose from 'mongoose';

const sentenceSchema = new mongoose.Schema({
    desSentence: String,
    idIntent: mongoose.Schema.Types.ObjectId,
    idUser: mongoose.Schema.Types.ObjectId,
    dtInsert: Date,
    dtUpdate: Date
});

const Sentence = mongoose.model('Sentence', sentenceSchema);

export default Sentence;
