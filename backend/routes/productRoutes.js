const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, likeProduct, deleteProduct, getMyProducts } = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, seller, upload.single('image'), createProduct);

router.route('/myproducts')
    .get(protect, seller, getMyProducts);

router.route('/:id')
    .get(getProductById)
    .delete(protect, deleteProduct);

router.route('/:id/like').post(protect, likeProduct);

module.exports = router;
