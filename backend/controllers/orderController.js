const Order = require('../models/Order');

// Create new order
const addOrderItems = async (req, res) => {
    try {
        const { products, totalPrice } = req.body;

        if (products && products.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            userId: req.user._id,
            products,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user orders (Buyer)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('products.productId', 'title price image');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Seller/Admin)
const getOrders = async (req, res) => {
    try {
        // For simplicity, returning all orders.
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('userId', 'name email').populate('products.productId', 'title price image');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrderItems, getMyOrders, getOrders };
