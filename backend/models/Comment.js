const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    text: { type: String, required: true },
    storeReply: { type: String, default: null }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
