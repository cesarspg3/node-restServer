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

// ===================
// Google Client Id
// ===================
process.env.CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE || '694527716369-nhlnl4dsn06q8f395b44kugv742qnlrl.apps.googleusercontent.com';