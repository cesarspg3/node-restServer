// ===================
// Puerto
// ===================
process.env.PORT = process.env.PORT || 3000;

// ===================
// Entorno
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===================
// Vencimiento del token
// ===================
process.env.EXPIRATION =  60 * 60 * 24 * 30;

// ===================
// SEED de autenticación
// ===================
process.env.SEED = process.env.SEED || 60 * 60 * 24 * 30;

// ===================
// BD
// ===================
let urlDB;
if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://cesarSPG3:KrChafxvRp7XvmoC@cluster0-udnal.mongodb.net/cafe';
}
process.env.URLDB = urlDB;