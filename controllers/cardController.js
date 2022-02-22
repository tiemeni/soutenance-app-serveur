const cartRepository = require('../repository/repository');
const Produits = require('../models/Product');
const Order = require('../models/Order');
const Stripe = require('stripe');
const { v4: uuidv4 } = require('uuid');
const { calculateAmount } = require('../utils/manageAmount');
const stripe = Stripe('sk_test_51JHVCtF05VKCAD6XLDKnfvfTnl4WzXg9vzGG82TuZzaUTrLzJfzCgUTC6z0eBQGsZtwg6DGMRulSJLj3OqYjwuEX0002PVqevl');

exports.addItemToCart = async (req, res) => {
    const {
        id_produit
    } = req.body;
    const qte_produit = Number.parseInt(req.body.qte_produit);
    // const userId = req.user.userId;

    try {
        // let cart = await cartRepository.cart(userId);
        let cart = await cartRepository.cart();
        // console.log("Panier: ", cart);
        let productDetails = await Produits.findById(id_produit);
        if (!productDetails) {
            return res.status(500).json({
                type: "Not Found",
                msg: "Invalid request"
            })
        }
        //--If Cart Exists ----
        if (cart) {
            //---- Check if index exists ----
            const indexFound = cart.items.findIndex(item => item.id_produit.id == id_produit);
            //------This removes an item from the the cart if the qte_produit is set to zero, We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && qte_produit <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
            //----------Check if product exist, just add the previous qte_produit with the new qte_produit and update the total prix_produit-------
            else if (indexFound !== -1) {
                cart.items[indexFound].qte_produit = cart.items[indexFound].qte_produit + qte_produit;
                cart.items[indexFound].total = cart.items[indexFound].qte_produit * productDetails.prix_unitaire;
                cart.items[indexFound].prix_produit = productDetails.prix_unitaire
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----Check if qte_produit is greater than 0 then add item to items array ----
            else if (qte_produit > 0) {
                cart.items.push({
                    id_produit: id_produit,
                    qte_produit: qte_produit,
                    prix_produit: productDetails.prix_unitaire,
                    total: parseInt(productDetails.prix_unitaire * qte_produit)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----If qte_produit of prix_produit is 0 throw the error -------
            else {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Invalid request"
                })
            }
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process successful",
                data: data
            })
        }
        //------------ This creates a new cart and then adds the item to the cart that has been created------------
        else {
            const cartData = {
                // id_user: userId,
                items: [{
                    id_produit: id_produit,
                    qte_produit: qte_produit,
                    total: parseInt(productDetails.prix_unitaire * qte_produit),
                    prix_produit: productDetails.prix_unitaire
                }],
                subTotal: parseInt(productDetails.prix_unitaire * qte_produit)
            }
            cart = await cartRepository.addItem(cartData);
            // let data = await cart.save();
            res.json(cart);
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
}
exports.getCart = async (req, res) => {
    try {
        // let userId = req.user.userId;
        // console.log("get Cart: ", userId);
        // let cart = await cartRepository.cart(userId)
        let cart = await cartRepository.cart()
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart not Found",
            })
        }
        res.status(200).json({
            status: true,
            data: cart
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
}

exports.emptyCart = async (req, res) => {
    try {
        let cart = await cartRepository.cart();
        cart.items = [];
        cart.subTotal = 0
        let data = await cart.save();
        res.status(200).json({
            type: "success",
            mgs: "Cart has been emptied",
            success: true,
            data: data
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
}

exports.removeItem = async (req, res) => {
    const {
        id_produit
    } = req.body;
    const qte_produit = Number.parseInt(req.body.qte_produit);

    try {
        let cart = await cartRepository.cart();
        // console.log("Panier: ", cart);
        let productDetails = await Produits.findById(id_produit);
        if (!productDetails) {
            return res.status(500).json({
                type: "Not Found",
                msg: "Invalid request"
            })
        }

        if (cart) {
            //---- Check if index exists ----
            const indexFound = cart.items.findIndex(item => item.id_produit.id == id_produit);
            //------This removes an item from the the cart if the qte_produit is set to zero, We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && qte_produit <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
        }

        let data = await cart.save();
        res.status(200).json({
            type: "success",
            mgs: "Process successful",
            data: data
        })

    } catch (error) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something went wrong",
            err: err
        })
    }
}

exports.confirmPayment = async (req, res) => {
    const { token, panel } = req.body
    const amount = calculateAmount(panel)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product: {
                        name: panel.productId
                    },
                    unit_amount: (amount * 100) / 10,
                },
                quantity: 10,
            },
        ],
        mode: "payment",
        success_url: `https://www.google.com`,
        cancel_url: `https://www.youtube.com`,
    });

    res.json({ id: session.id });
};

exports.confirmPayment = async (req, res) => {
    res.status(200).json({success : true})
};