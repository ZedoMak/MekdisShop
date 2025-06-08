const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, updateCartItemQuantity, removeCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getCart)
    .post(addItemToCart);

router.route('/item/:productId')
    .put(updateCartItemQuantity)
    .delete(removeCartItem);

module.exports = router;