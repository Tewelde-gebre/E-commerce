const ContactMessage = require('../models/ContactMessage');

// Submit a contact message
const submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newMessage = new ContactMessage({ name, email, subject, message });
        await newMessage.save();

        res.status(201).json({ message: 'Message received! We will get back to you soon.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitMessage };
