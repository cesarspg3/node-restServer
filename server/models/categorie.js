const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorieSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = mongoose.model('Categorie', categorieSchema)