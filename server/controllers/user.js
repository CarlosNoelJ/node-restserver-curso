const express = require('express');
const bcrypt = require('bcrypt');
const _ =require('underscore');
const User = require('../models/user');
const app = express();

app.get('/user', function(req, res) {

    let from = req.query.from || 0;
    from = Number(from);

    let limitePage = req.query.limitPage || 5;

    limitePage = Number(limitePage);
    
    User.find({}, 'name email role state google img')
        .skip(from)
        .limit(limitePage)
        .exec( (err, users) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({}, (err, counting) => {
                
                res.json({
                    ok:true,
                    users,
                    counted: counting
                });
            });
        });
});

app.post('/user', function(req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });

    user.save( (err, userDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        })

    });
});

app.put('/user/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick( req.body, ['name','email','img','role','state']);

    User.findByIdAndUpdate ( id, body, { new:true, runValidators : true },( err, userDB) => {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            OK:true,
            user: userDB
        })
    })
});

app.delete('/user/:id', function(req, res) {
    
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userDeleted) => {
    
    let changeEstate = {
        state: false
    };

    User.findByIdAndUpdate(id, changeEstate, {new: true}, (err, userDeleted) => {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if(!userDeleted){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not Found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        })
    })   
});


module.exports = app;