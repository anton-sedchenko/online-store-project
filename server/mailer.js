const nodemailer = require('nodemailer');

// транспортер для відправки пошти
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger: true,
    debug: true,
});

// testing bugs
transporter.verify((err, success) => {
    if (err) {
        console.error('SMTP verify error:', err);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});
//

module.exports = transporter;