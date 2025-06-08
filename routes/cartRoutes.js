const express = require('express');
const router = express.Router();
const { getCart, addItemToCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getCart)
    .post(addItemToCart);

module.exports = router;