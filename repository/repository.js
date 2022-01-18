const Cart = require('../models/Cart');
exports.cart = async (userId) => {
    // const carts = await Cart.findOne({ $or: [{ id_user: userId }] }).populate({
    //     path: "items.id_produit",
    //     select: "nom_produit small_image_url description couleur_dispo taille_dispo prix_produit total"
    // });

    const carts = await Cart.findOne().populate({
        path: "items.id_produit",
        select: "nom_produit image_url description couleur_dispo taille_dispo prix_produit total"
    });
    
    return carts;
};

exports.addItem = async payload => {
    const newItem = await Cart.create(payload);
    return newItem;
}