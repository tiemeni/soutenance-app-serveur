const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nom_produit: {
        type: String,
        required: true,
    },
    brand_name: {
        type: String,
        required: true,
    },
    category: String,
    description: String,
    image_url: {
        type: String,
        required: true,
    },
    small_image_url: {
        type: String,
    },
    couleur_dispo: {
        type: String,
        required: true,
    },
    taille_dispo: {
        type: String,
        required: true,
    },
    prix_unitaire: {
        type: Number,
        required: true,
    },
    qte_stock: {
        type: Number,
    },
    description_img1: {
        type: String,
    },
    description_img2: {
        type: String,
    },
    description_img3: {
        type: String,
    },
    description_img4: {
        type: String,
    },
    description_img5: {
        type: String,
    },
    description_img6: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date,
});

module.exports = mongoose.model('Products', productSchema);