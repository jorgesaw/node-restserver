// User models

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'SUPER_ROLE'],
    message: '{VALUE} it is not a valid role.'
};

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValid
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: String,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password;

    return userObject;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

module.exports = mongoose.model('User', userSchema);