//Products models

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required.'] },
    priceUnit: { type: Number, required: [true, 'Price is required.'] },
    description: { type: String, required: false },
    img: { type: String, required: false },
    active: { type: Boolean, default: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

productSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

module.exports = mongoose.model('Product', productSchema);