const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders, getOrderById, getAllOrders } = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .post(createOrder)
    .get(getMyOrders);

router.route('/:id')
    .get(getOrderById);

router.route('/all/orders').get(admin, getAllOrders); 

module.exports = router;