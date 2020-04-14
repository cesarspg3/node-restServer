const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'] //uniqueValidator
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles, //uniqueValidator
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

userSchema.methods.toJSON = function() {// Borrar contraseña de la respuesta
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject
}
userSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser único' } )//uniqueValidator

module.exports = mongoose.model('user', userSchema)