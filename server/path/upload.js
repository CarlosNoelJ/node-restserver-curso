const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                message: 'No files selected'
            });
    }

    // Validate type
    let validType = ['products', 'users'];
    if (validType.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Allowed types: ' + validType.join(', ')
            }
        });
    }

    let file = req.files.file;
    let cuttedName = file.name.split('.');
    let extension = cuttedName[cuttedName.length - 1];

    // Allowe Extensions
    let extensionAllowed = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionAllowed.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Allowed extensions: ' + extensionAllowed.join(', '),
                ext: extension
            }
        });
    }

    // Change file name
    // 1598456namenamename-123.jpg
    let nameFile = `${id + file.name}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${nameFile}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        // Here, Image Uploaded
        if (type === 'users') {
            imageUser(id, res, nameFile);
        }
        else if (type === 'products') {
            imageProduct(id, res, nameFile);   
        }
    });
});

function imageUser(id, res, nameFile) {

    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(nameFile, 'users');

            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!userDB) {
            deleteFile(nameFile, 'users');

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'User not exists'
                    }
                });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = nameFile;

        userDB.save((err, userSaved) => {

            res.json({
                ok: true,
                user: userSaved,
                img: nameFile
            });
        });

    });
}

function imageProduct(id, res, nameFile) {

    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(nameFile, 'products');

            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!productDB) {
            deleteFile(nameFile, 'products');

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'User not exists'
                    }
                });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = nameFile;

        productDB.save((err, productSave) => {

            res.json({
                ok: true,
                product: productSave,
                img: nameFile
            });
        });

    });
}


function deleteFile(nameFile, type, ) {
    let pathUrl = path.resolve(__dirname, `../../uploads/${type}/${nameFile}`);

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;