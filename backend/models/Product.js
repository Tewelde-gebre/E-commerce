const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ['Birr', 'Dollar'], default: 'Birr' },
    image: { type: String, required: true },
    category: { type: String, required: true, default: 'cloths' },
    productType: { type: String },
    gender: { type: String, default: 'unisex' },
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }],
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
