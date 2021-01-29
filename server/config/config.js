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

// Google client ID
process.env.CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE || '605397945767-1tks299v6vqic270c3f7e0f43i0p2m1e.apps.googleusercontent.com';