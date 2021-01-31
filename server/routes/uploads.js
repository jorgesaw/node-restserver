const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const User = require('../models/users');
const Product = require('../models/products');

const app = express();

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;
    let file;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        // return res.status(400).send('No files were uploaded.');
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded.'
                }
            });
    }

    let typesValids = ['users', 'products'];
    if (typesValids.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Type not valid. Allowed types:' + typesValids.join(', '),
                type
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    file = req.files.file;
    filenameArray = file.name.split('.');
    let extension = filenameArray[filenameArray.length - 1];

    // Allowed extensions
    let allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (allowedExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension not valid. Allowed extensions:' + allowedExtensions.join(', '),
                extension
            }
        })
    }

    // Set filename
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`


    uploadPath = `uploads/${type}/${fileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, (err) => {
        if (err)
        // return res.status(500).send(err);
            return res.status(500).json({
            ok: false,
            err
        });

        switch (type) {
            case 'users':
                updatedPictureUser(id, fileName, type, res);
                break;
            case 'products':
                updatedPictureProduct(id, fileName, type, res);
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Extension not valid. Allowed extensions:' + allowedExtensions.join(', '),
                        extension
                    }
                })

        }
    });
});

function updatedPictureUser(id, fileName, typeDir, res) {
    User.findById(id, (err, userDB) => {
        if (err) {
            removeFile(fileName, typeDir);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            removeFile(fileName, typeDir);
            return res.status(400).json({
                ok: false,
                err: 'User not found.'
            });
        }

        removeFile(userDB.img, typeDir);

        userDB.img = fileName;
        userDB.save((err, userUpdated) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                user: userUpdated,
                picture: fileName
            })
        });

    });
}

function updatedPictureProduct(id, fileName, typeDir, res) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            removeFile(fileName, typeDir);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            removeFile(fileName, typeDir);
            return res.status(400).json({
                ok: false,
                err: 'Product not found.'
            });
        }

        console.log(productDB.img, typeDir);

        removeFile(productDB.img, typeDir);

        productDB.img = fileName;
        productDB.save((err, productUpdated) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            res.json({
                ok: true,
                product: productUpdated,
                picture: fileName
            })
        });

    });
}

function removeFile(fileName, typeDir) {
    let pathPicture = path.resolve(__dirname, `../../uploads/${typeDir}/${fileName}`);
    if (fs.existsSync(pathPicture))
        fs.unlinkSync(pathPicture);
}

module.exports = app;