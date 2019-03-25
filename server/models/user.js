const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validateRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is necessary']
    },
    password: {
        type: String,
        required: [true, 'Password requiered']
    },
    img: {
        type: String,
        required: false
    }, 
    role: {
        type:String,
        default: 'USER_ROLE',
        enum: validateRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userSchema.plugin( uniqueValidator, { message: '{PATH} must be unique' } );

module.exports  = mongoose.model( 'User', userSchema );