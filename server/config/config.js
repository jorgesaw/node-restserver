// PORT
process.env.PORT = process.env.PORT || 3000;

// Enviroment 
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Data Base
let urlDB = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';

process.env.URLDB = urlDB;