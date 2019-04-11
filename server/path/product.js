
const express = require('express');

const { verifyToken } = require('../middlewares/authentication');
const _ = require('underscore');
let app = express();
let Product = require('../models/product');

// ================
// Get Products
// ================
app.get('/product', verifyToken, (req, res) => {
    // get all products
    // populate: user and category
    // pagin

    let from = req.query.from || 0;
    from = Number(from);

    Product.find({ availability: true })
        .skip(from)
        .limit(8)
        .sort('category')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product
            });
        });

});

// ================
// Get Product by ID
// ================
app.get('/product/:id', verifyToken, (req, res) => {
    // populate: user and category
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
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

        res.json({
            ok: true,
            product: productDB
        });
    });
});

// ================
// Search Products
// ================
app.get('/product/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({name: regex})
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products
            });
        })

});

// ================
// Create a Product
// ================
app.post('/product', verifyToken, (req, res) => {
    // Save a product
    // Save a category from the list of category

    let body = req.body;

    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        availability: body.availability,
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
        });
    });
});

// ================
// Update a Product
// ================
app.put('/product/:id', verifyToken, (req, res) => {
    // Save a product
    // Save a category from the list of category

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'availability', 'category', 'user']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidator: true }, (err, productDB) => {
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

        res.json({
            ok: true,
            product: productDB
        });
    });

});

// ================
// Delete a Product
// ================
app.delete('/product/:id', verifyToken, (req, res) => {
    // Change the Availability to false

    let id = req.params.id;

    let changeAvailability = {
        availability: false
    };

    Product.findByIdAndUpdate(id, changeAvailability, { new: true }, (err, productAvaila) => {

        console.log(changeAvailability);

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productAvaila) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productAvaila,
            message: 'Product Deleted'
        })
    });
});

module.exports = app;