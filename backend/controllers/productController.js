const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? { title: { $regex: req.query.keyword, $options: 'i' } } : {};
        const products = await Product.find({ ...keyword })
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('sellerId', 'name').populate('likes', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create product (Seller)
const createProduct = async (req, res) => {
    try {
        const { title, description, price, currency, category, productType, gender, stock, sizes } = req.body;
        let image = '';
        if (req.file) {
            image = `/${req.file.path.replace(/\\/g, '/')}`;
        } else {
            return res.status(400).json({ message: 'Image is required' });
        }

        const product = new Product({
            title,
            description,
            price,
            currency: currency || 'Birr',
            image,
            category: category || 'cloths',
            productType,
            gender: gender || 'unisex',
            stock: stock || 0,
            sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
            sellerId: req.user._id
        });

        const createdProduct = await product.save();

        // Notify all buyers
        const User = require('../models/User');
        const Notification = require('../models/Notification');
        const buyers = await User.find({ role: 'buyer' });
        
        const notifications = buyers.map(buyer => ({
            recipient: buyer._id,
            message: `New product added: ${createdProduct.title}`,
            productId: createdProduct._id
        }));
        
        await Notification.insertMany(notifications);

        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like product
const likeProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyLiked = product.likes.find(r => r.toString() === req.user._id.toString());
        if (alreadyLiked) {
            return res.status(400).json({ message: 'Product already liked' });
        }

        product.likes.push(req.user._id);
        await product.save();
        
        // Notify seller about the like
        const Notification = require('../models/Notification');
        if (product.sellerId.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: product.sellerId,
                message: `A user liked your product: ${product.title}`,
                productId: product._id
            });
        }

        res.status(201).json({ message: 'Product liked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized' });
            }
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get seller's products
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, likeProduct, deleteProduct, getMyProducts };
