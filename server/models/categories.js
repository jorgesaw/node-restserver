//Categories models

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let categorySchema = new mongoose.Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'Description is required.']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    active: {
        type: Boolean,
        default: true
    }
});

categorySchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

module.exports = mongoose.model('Category', categorySchema);