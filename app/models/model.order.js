var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

var orderSchema = new Schema({
    productId : {
        type : Schema.Types.ObjectId,
        ref : 'products',
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'users'
    },
    orderId: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 10
    },
    buyingPrice: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 10
    },
    price: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 10
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 2,
        default: 1
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


orderSchema.plugin(timestamps, {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated'
});

module.exports = mongoose.model('order', orderSchema, 'order');




