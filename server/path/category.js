

const express = require('express');

let { verifyToken, verifyAdmin } = require('../middlewares/authentication');

let app = express();

let Category = require('../models/category');

// ======================
// Show all the categories
// ======================
app.get('/category', (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                category
            });
        })
});

// ======================
// Show Category by Id
// ======================
app.get('/category/:id', (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

// ======================
// Create Category
// ======================
app.post('/category', verifyToken, (req, res) => {
    // return the new Category
    // req.user._id

    let body = req.body;

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
        });
    });

});

// ======================
// Update Category
// ======================
app.put('/category/:id', [verifyToken, verifyAdmin], (req, res) => {
    // return the new Category
    // req.user._id

    let id = req.params.id;
    let body = req.body;

    let desCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, desCategory, { new: true, runValidators: true }, (err, categoryDB) => {

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
        });
    });
});

// ======================
// Delete Category
// ======================
app.delete('/category/:id', [verifyToken, verifyAdmin], (req, res) => {
    // only administrator
    // category.findByIdAndremove...

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDeleted) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoryDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not Found'
                }
            });
        };

        res.json({
            ok: true,
            category: categoryDeleted
        });

    });
});

module.exports = app;