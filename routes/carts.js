const router = require("express").Router();
const cartController = require("../controllers/cardController");
const auth = require("../middlewares/auth");

// router.post("/", auth, cartController.addItemToCart);
// router.get("/", auth, cartController.getCart);
// router.delete("/empty-cart", auth, cartController.emptyCart);
router.post("/", cartController.addItemToCart);
router.get("/paiement", cartController.getAllPaiements);
router.delete("/empty-cart", cartController.emptyCart);
router.post("/payment", cartController.confirmPayment);
router.post("/removeItem", cartController.removeItem);

module.exports = router;