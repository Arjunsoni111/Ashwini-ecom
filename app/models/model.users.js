var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var usersSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 100,
        trim: true
    },
    email: {
        type: String,
        minlength: 1,
        maxlength: 500,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        minlength: 1,
        maxlength: 15,
    },
    photoUrl: {
        type: String
    },
    accessToken: {
        type: String
    },
    loginType: {
        type: String
    },
    loginId: {
        type: String
    },
    isActive: {
        type: Number,
        required: true,
        default: 1
    },
    isDeleted: {
        type: Number,
        required: true,
        default: 0
    }
});

usersSchema.plugin(timestamps, {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated'
});


module.exports = mongoose.model('users', usersSchema, 'users');
