// PORT
process.env.PORT = process.env.PORT || 3000;

// Enviroment 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Data Base
let urlDB = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';

process.env.URLDB = urlDB;

// Token

// Expiration: 60s x 60m x 24 hs x 30d
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;


// SEED of authentication
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'seed_token';