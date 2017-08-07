import * as mongoose from 'mongoose';

const classifySchema = new mongoose.Schema({
    classifyName: String,
    desClassify: String,
    classifyToken: String,
    idUser: mongoose.Schema.Types.ObjectId,
    dtInsert: Date,
    dtUpdate: Date
});

const Classify = mongoose.model('Classify', classifySchema);

export default Classify;
