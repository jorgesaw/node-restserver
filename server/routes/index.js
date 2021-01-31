const express = require('express')

const app = express()


app.use(require('./users'));
app.use(require('./login'));

app.use(require('./categories'));
app.use(require('./products'));
app.use(require('./uploads'));
app.use(require('./pictures'));

module.exports = app;