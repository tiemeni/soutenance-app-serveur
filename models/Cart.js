const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    id_produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
    },
    qte_produit: {
        type: Number,
        required: true,
        min: [1, 'Quanty can not be less than 1.'],
    },
    prix_produit: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const cartSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    items: [itemSchema],
    subTotal: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);