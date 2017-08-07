import * as mongoose from 'mongoose';

const intentSchema = new mongoose.Schema({
    idClassify: mongoose.Schema.Types.ObjectId,
    idUser: mongoose.Schema.Types.ObjectId,
    intentName: String,
    dtInsert: Date,
    dtUpdate: Date
});

const Intent = mongoose.model('Intent', intentSchema);

export default Intent;
