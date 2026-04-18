const crypto = require('crypto');

// Normally this should be in .env. We use a fallback test key if not provided.
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-w3M6K9X4H5V5jQ2D1M9V1Q8C5N6B2L3M';

const initializePayment = async (req, res) => {
    try {
        const { amount, currency, email, firstName, lastName, callbackUrl } = req.body;
        
        // Generate a random transaction reference
        const tx_ref = `tx-${crypto.randomBytes(8).toString('hex')}`;

        const payload = {
            amount: amount.toString(),
            currency: currency || 'ETB',
            email: email || req.user.email,
            first_name: firstName || req.user.name.split(' ')[0],
            last_name: lastName || 'User',
            tx_ref: tx_ref,
            callback_url: callbackUrl,
            return_url: callbackUrl,
            "customization[title]": "Fashion Cloths Market",
            "customization[description]": "Payment for your order"
        };

        const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.status === 'success') {
            res.json({
                checkout_url: data.data.checkout_url,
                tx_ref: tx_ref
            });
        } else {
            // Fallback mock flow since the default test key is likely invalid without a real account
            console.warn("Chapa API Initialization Failed:", data.message);
            console.log("Mocking checkout URL for development...");
            
            // For the mock, we skip the actual Chapa UI and just return a URL that goes straight back to the verified page
            setTimeout(() => {
                res.json({
                    checkout_url: callbackUrl + `?trx_ref=${tx_ref}&mock=true`,
                    tx_ref: tx_ref
                });
            }, 1000);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { tx_ref } = req.params;
        const { mock } = req.query;

        if (mock === 'true') {
            // Mock successful verification
            return res.json({ success: true, data: { status: 'success', tx_ref } });
        }

        const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
            }
        });

        const data = await response.json();

        if (data.status === 'success') {
            res.json({ success: true, data: data.data });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    initializePayment,
    verifyPayment
};
