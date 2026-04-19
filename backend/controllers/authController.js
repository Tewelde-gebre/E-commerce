const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(`Registration attempt for: ${email}`);

        let role = req.body.role || 'buyer';
        const adminEmail = process.env.ADMIN_EMAIL || 'tewe@gmail.com';

        if (role === 'admin' && email !== adminEmail) {
            console.warn(`Unauthorized admin registration attempt: ${email}`);
            return res.status(403).json({ message: 'Not authorized to register as admin' });
        }

        if (email === adminEmail) {
            role = 'admin';
            console.log(`Email matches adminEmail, setting role to admin for: ${email}`);
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log(`Registration failed: User already exists (${email})`);
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Server configuration error (JWT_SECRET)' });
        }

        const user = await User.create({ name, email, password, role });

        if (user) {
            console.log(`Registration successful for: ${email} (${role})`);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            console.error(`Registration failed: User creation returned null for ${email}`);
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(`Registration Error for ${req.body.email}:`, error.message);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const adminEmail = process.env.ADMIN_EMAIL || 'tewe@gmail.com';

        if (user && (await user.matchPassword(password))) {
            if (user.email === adminEmail && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            }

            if (user.role === 'admin' && user.email !== adminEmail) {
                return res.status(403).json({ message: 'Not authorized as admin' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.file) {
                user.avatar = `/${req.file.path.replace(/\\/g, '/')}`;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile, getUsers, updateUserProfile };
