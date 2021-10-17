const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone_number: Number,
    adresse: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date,

});

module.exports = mongoose.model('Users', userSchema);