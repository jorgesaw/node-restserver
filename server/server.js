// Server
//ID_CLIENTE_GOOGLE: 605397945767-1tks299v6vqic270c3f7e0f43i0p2m1e.apps.googleusercontent.com
//PASSWORD: AALl1pJCafFF0y2pHWuco7nB
require('./config/config');
const express = require('express')
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Enable public dir
app.use(express.static(
    path.resolve(
        __dirname, '../public')
));

// Routes global config
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;

    console.log('Online database.');
});

app.listen(process.env.PORT, () => {
    console.log(`Listing port: ${process.env.PORT}`);
})