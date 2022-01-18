const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    id_cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts",
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