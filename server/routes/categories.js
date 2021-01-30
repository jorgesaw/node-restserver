const express = require('express');

const Category = require('../models/categories');

const { verifyToken, verifyAdminSuperUser } = require('../middlewares/authentication');

const app = express();

app.get('/categories', verifyToken, (req, res) => {
    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 30;

    Category.find({ 'active': true }, 'description active user')
        .skip(since)
        .limit(limit)
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Category.countDocuments({ 'active': true }, (err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categories,
                    total: count
                });
            });

        });
})

app.get('/categories/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id)
        .populate('user', 'name email')
        .exec((err, category) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                category,
            });
        });
})

app.post('/categories', verifyToken, function(req, res) {
    let body = req.body

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
});

app.put('/categories/:id', verifyToken, function(req, res) {

    let id = req.params.id;
    let body = req.body;

    let descCategory = {
        description: body.description
    }

    Category.findByIdAndUpdate(id, descCategory, {
            new: true, //devuelve el objeto actualizado 
            runValidators: true, //aplica las validaciones del esquema del modelo
            context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
        },
        (err, categoryDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoryDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                category: categoryDB
            })

        });

})

app.delete('/categories/:id', [verifyToken, verifyAdminSuperUser], function(req, res) {
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userDeleted) => {
    Category.findByIdAndUpdate(id, { 'active': false }, { new: true }, (err, categoryDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDeleted)
            return res.status(400).json({
                ok: false,
                err: 'Category not found.'
            });

        res.json({
            ok: true,
            category: categoryDeleted,
            message: 'Category deleted.'
        })
    });
});

module.exports = app;