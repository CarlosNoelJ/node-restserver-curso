// ell PROCESS es una variable que siempre esta corriendo

// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Environment
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Expiration Token Date
// ============================
// 60 seconds
// 60 minutes
// 24 hours
// 30 days
process.env.EXPIRATION_TOKEN = '48h';

// ============================
//  Authentication SEED
// ============================
process.env.SEED = process.env.SEED || 'secret-develop';

// ============================
//  Data Base
// ============================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ============================
//  Google client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '11638930418-cnnogthn5gequ0rgle25dfhvqqakj578.apps.googleusercontent.com' ;