const express = require('express');
const router = express.Router();
const { addComment, getComments, getSellerComments, replyToComment } = require('../controllers/commentController');
const { protect, seller } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addComment);
    
router.route('/seller').get(protect, seller, getSellerComments);
router.route('/:id/reply').put(protect, seller, replyToComment);

router.route('/:productId').get(getComments);

module.exports = router;
