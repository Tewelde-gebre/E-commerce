const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, getUsers, updateUserProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);
router.get('/', protect, admin, getUsers);

module.exports = router;
