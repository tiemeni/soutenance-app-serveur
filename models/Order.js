const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    delivery_date: {
        type: Date
    },
    paid: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);