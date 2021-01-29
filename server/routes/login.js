// Login

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);

const User = require('../models/users');

const app = express()

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password incorrect.'
                }
            });
        }

        if (!bcrypt.compareSync(req.body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or password incorrect.'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });

});

// Google configurations

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID_GOOGLE, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
// verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        });

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {
            if (userDB.google === false) { // SI el usuario fue creado de manera normal sin usar Google.
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal.'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            // Si el usuario no existe en nuestra base de datos.
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.picture;
            user.goole = true;
            user.password = ':)';
            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            });
        }
    });

});

module.exports = app;