const Comment = require('../models/Comment');
const Product = require('../models/Product');

// Add comment
const addComment = async (req, res) => {
    try {
        const { productId, text } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const comment = new Comment({
            userId: req.user._id,
            productId,
            text
        });

        const createdComment = await comment.save();
        const populatedComment = await Comment.findById(createdComment._id).populate('userId', 'name');

        // Notify seller
        const Notification = require('../models/Notification');
        if (product.sellerId.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: product.sellerId,
                message: `New comment on your product: ${product.title}`,
                productId: product._id
            });
        }

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comments for a product
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ productId: req.params.productId }).populate('userId', 'name');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comments for all products belonging to a seller
const getSellerComments = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id });
        const productIds = products.map(p => p._id);

        const comments = await Comment.find({ productId: { $in: productIds } })
            .populate('userId', 'name')
            .populate('productId', 'title image price currency')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reply to a comment (Seller)
const replyToComment = async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.findById(req.params.id).populate('productId');

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.productId.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to reply to this comment' });
        }

        comment.storeReply = text;
        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addComment, getComments, getSellerComments, replyToComment };
