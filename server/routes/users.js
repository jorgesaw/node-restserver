// User routes

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/users');
const { verifyToken, verifyAdminSuperUser } = require('../middlewares/authentication');

const app = express()


app.get('/user', verifyToken, (req, res) => {
    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 5;

    User.find({ 'state': true }, 'name email role img state google')
        .skip(since)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ 'state': true }, (err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    users,
                    total: count
                });
            });

        });
})

app.post('/user', [verifyToken, verifyAdminSuperUser], function(req, res) {
    let body = req.body
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/user/:id', verifyToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        })

    });

})

app.delete('/user/:id', [verifyToken, verifyAdminSuperUser], function(req, res) {
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userDeleted) => {
    User.findByIdAndUpdate(id, { 'state': false }, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDeleted)
            return res.status(400).json({
                ok: false,
                err: 'User not found.'
            });

        res.json({
            ok: true,
            user: userDeleted
        })
    });
});

module.exports = app;