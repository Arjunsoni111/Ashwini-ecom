var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

var productsSchema = new Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    sku: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    price: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 10
    },
    offerPrice: {
        type: String,
        default: 0,
        trim: true,
        minlength: 1,
        maxlength: 10
    },
    offerStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 10
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

productsSchema.plugin(timestamps, {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated'
});

module.exports = mongoose.model('products', productsSchema, 'products');




