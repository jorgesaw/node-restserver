const express = require('express');

const Product = require('../models/products');

const { verifyToken, verifyAdminSuperUser } = require('../middlewares/authentication');

const app = express();

app.get('/products', verifyToken, (req, res) => {
    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 30;

    Product.find({ 'active': true }, 'name priceUnit description active category user')
        .skip(since)
        .limit(limit)
        .sort('name')
        .populate('category', 'description active')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments({ 'active': true }, (err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    products,
                    total: count
                });
            });

        });
})

app.get('/products/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('category', 'description active')
        .populate('user', 'name email')
        .exec((err, productDB) => {
            if (err) {
                if (err.path === '_id') {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Product not found.'
                        }
                    });
                }
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productDB,
            });
        });
})

//Searchs
app.get('/products/searchs/:q', verifyToken, (req, res) => {
    let since = Number(req.query.since) || 0;
    let limit = Number(req.query.limit) || 30;

    let q = req.params.q;
    let regexQuery = new RegExp(q, 'i');

    Product.find({ 'active': true, name: regexQuery }, 'name priceUnit description active category user')
        .skip(since)
        .limit(limit)
        .sort('name')
        .populate('category', 'description active')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments({ 'active': true }, (err, count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    products,
                    total: count
                });
            });

        });
})


app.post('/products', verifyToken, function(req, res) {
    let body = req.body

    let product = new Product({
        name: body.name,
        priceUnit: body.priceUnit,
        description: body.description,
        active: body.active,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })
    })
});

app.put('/products/:id', verifyToken, function(req, res) {

    let id = req.params.id;
    let body = req.body;

    let descProduct = {
        name: body.name,
        priceUnit: body.priceUnit,
        description: body.description,
        active: body.active,
        category: body.category
    }

    Product.findByIdAndUpdate(id, descProduct, {
            new: true, //devuelve el objeto actualizado 
            runValidators: true, //aplica las validaciones del esquema del modelo
            context: 'query' //necesario para las disparar las validaciones de mongoose-unique-validator
        },
        (err, ProductDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!ProductDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Product not found.'
                    }
                });
            }

            res.json({
                ok: true,
                Product: ProductDB
            })

        });

})

app.delete('/products/:id', [verifyToken, verifyAdminSuperUser], function(req, res) {
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userDeleted) => {
    Product.findByIdAndUpdate(id, { 'active': false }, { new: true }, (err, productDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDeleted)
            return res.status(400).json({
                ok: false,
                err: 'Product not found.'
            });

        res.json({
            ok: true,
            Product: productDeleted,
            message: 'Product deleted.'
        })
    });
});

module.exports = app;