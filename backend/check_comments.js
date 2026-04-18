const mongoose = require('mongoose');
require('dotenv').config();
const Comment = require('./models/Comment');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const comments = await Comment.find().populate('userId', 'name').lean();
    console.log(JSON.stringify(comments, null, 2));
    process.exit();
}).catch(console.error);
