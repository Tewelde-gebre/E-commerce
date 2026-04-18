const crypto = require('crypto');

const CHAPA_SECRET_KEY = 'CHASECK_TEST-w3M6K9X4H5V5jQ2D1M9V1Q8C5N6B2L3M';

const test = async () => {
    try {
        const tx_ref = `tx-${crypto.randomBytes(8).toString('hex')}`;
        const payload = {
            amount: "100",
            currency: 'ETB',
            email: 'test@example.com',
            first_name: 'Abebe',
            last_name: 'Kebede',
            tx_ref: tx_ref,
            callback_url: 'http://localhost:5173/buyer/payment/verify',
            return_url: 'http://localhost:5173/buyer/payment/verify',
            "customization[title]": "Fashion Cloths Market",
            "customization[description]": "Payment for your order"
        };
        console.log("Sending payload...");
        const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log("Response:", data);
    } catch (err) {
        console.error("Error:", err);
    }
};

test();
