const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log(`Found ${products.length} products:`);
        products.forEach(p => {
            console.log(`- Title: ${p.title} | Image: ${p.image}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkProducts();
