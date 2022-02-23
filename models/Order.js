const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    product_id : {
        type : [String],
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    author_prenom : {
        type : String,
        required : true
    },
    author_email : {
        type : String,
        required : true
    },
    author_adress : {
        type : String,
        required : true 
    },
    author_phone : {
        type : Number,
        required : true
    },
    paiement_date: {
        type: Date,
        default : new Date().toLocaleDateString()
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Paiement', orderSchema);