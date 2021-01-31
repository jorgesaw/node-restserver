const express = require('express');
const fs = require('fs');
const path = require('path');

const { verifyTokenPictureUrl } = require('../middlewares/authentication');

const app = express();

app.get('/pictures/:type/:picture', verifyTokenPictureUrl, (req, res) => {

    let type = req.params.type;
    let picture = req.params.picture;

    let pathPicture = path.resolve(__dirname, `../../uploads/${type}/${picture}`);
    if (fs.existsSync(pathPicture))
        res.sendFile(pathPicture);
    else {
        let pathNoImage = path.resolve(__dirname, '../assets/img/no-image.jpg');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;