const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes are private
router.use(protect);

router.route('/')
    .post(createOrder)
    .get(getMyOrders);

module.exports = router;