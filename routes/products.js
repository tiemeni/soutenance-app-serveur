const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Create product
router.post('/', async (req, res) => {
    const {
        nom_produit,
        brand_name,
        image_url,
        small_image_url,
        couleur_dispo,
        taille_dispo,
        prix_unitaire,
        category,
        description,
        qte_stock,
        description_img1,
        description_img2,
        description_img3,
        description_img4,
        description_img5,
        description_img6 } = req.body;

    if (nom_produit == null || brand_name == null || image_url == null || couleur_dispo == null || taille_dispo == null || prix_unitaire == null) {
        return res.status(400).json({ error: "Missing parameters." });
    }

    // Check if product already exist
    try {
        const isExist = await Product.findOne({ $or: [{ nom_produit: nom_produit }] })
        if (!isExist) { // Product doesn't exist
            try {
                const newProduct = await Product.create({
                    nom_produit: nom_produit,
                    brand_name: brand_name,
                    image_url: image_url,
                    couleur_dispo: couleur_dispo,
                    taille_dispo: taille_dispo,
                    prix_unitaire: prix_unitaire,
                    category: category,
                    description: description,
                    description_img1: description_img1,
                    description_img2: description_img2,
                    description_img3: description_img3,
                    description_img4: description_img4,
                    description_img5: description_img5,
                    description_img6: description_img6,
                });

                return res.status(201).json({
                    id_produit: newProduct._id,
                    nom_produit: newProduct.nom_produit,
                    status: "Created"
                });
            } catch (error) {
                return res.status(500).json({
                    error: "Cannot add product.",
                    Message: error
                })
            }
        } else { // Product exist
            return res.status(409).json({ error: "Product already exist." });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Unable to verify.",
            Message: error
        });
    }
});

// Get all product stored in db
router.get('/', async (req, res) => {
    try {
        const allProduct = await Product.find();
        return res.status(201).json(allProduct);
    } catch (error) {
        return res.status(500).json({
            error: "Unable to fetch products.",
            Message: error
        });
    }
})

// Get specific product
router.get('/:id_produit', async (req, res) => {
    try {
        const product = await Product.findOne({ $or: [{ _id: req.params.id_produit }] });
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({
            error: "Unable to get this product.",
            Message: error
        });
    }
})

// Remove product
router.delete('/:id_produit', async (req, res) => {
    try {
        const deleteProduct = await Product.deleteOne({ _id: req.params.id_produit });
        return res.status(201).json(deleteProduct);
    } catch (error) {
        return res.json({ error: error });
    }
});

module.exports = router;