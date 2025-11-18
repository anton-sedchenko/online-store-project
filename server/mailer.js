const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_SECURE === true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger: true,
    debug: true,
    // щоб, якщо таки буде конект, не чекати вічність
    connectionTimeout: 10000,
    socketTimeout: 10000,
});

module.exports = transporter;
