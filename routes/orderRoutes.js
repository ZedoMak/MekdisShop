const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes are private
router.use(protect);

router.route('/')
    .post(createOrder)
    .get(getMyOrders);


router.route('/:id')
    .get(getOrderById);
module.exports = router;