const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders } = require('../controllers/orderController');
const { protect, seller } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, seller, getOrders);
    
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;
