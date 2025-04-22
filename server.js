const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, email, pnumber, message, moveDate } = req.body;

    if (!name || !email || !pnumber || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: email,
            to: 'info@tucsonletsgetmoving.com',
            subject: `Let's Get Moving Contact Form - ${pnumber}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${pnumber}\n\nPreferred Move Date: ${moveDate} \nMessage:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent');
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Mail Error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
