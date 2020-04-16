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
process.env.EXPIRATION =  process.env.EXPIRATION || 1000 * 60 * 60;

// ===================
// SEED de autenticación
// ===================
process.env.SEED = process.env.SEED || 'este-es-es-seed-desarrollo';

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