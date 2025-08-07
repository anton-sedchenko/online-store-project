const Router = require('express')
const router = new Router()
const nodemailer = require('nodemailer')

/**
 * Відправка Telegram
 */
async function sendTelegram(text) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({chat_id: chatId, text})
    })
}

/**
 * Відправка на пошту через Nodemailer
 */
async function sendEmail({name, phone, comment}) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const html = `
        <h3>Замовлення зворотного дзвінка</h3>
        <p><strong>Імʼя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        ${comment ? `<p><strong>Коментар:</strong><br/>${comment}</p>` : ''}
      `

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFY_EMAIL,
            subject: 'Нове замовлення зворотнього дзвінка',
            html
        });
    } catch (smtpError) {
        console.error('❌ SMTP sendMail error:', smtpError);
        throw smtpError;
    }
}

router.post('/', async (req, res) => {
    try {
        const {name, phone, comment = ''} = req.body
        if (!name?.trim() || !phone?.trim()) {
            return res.status(400).json({ message: 'Імʼя і телефон обов’язкові' })
        }

        const text = `🔔 *Замовлення зворотнього дзвінка*\n` +
            `Імʼя: _${name}_\nТелефон: _${phone}_` +
            (comment ? `\nКоментар: _${comment}_` : '')

        await Promise.all([
            sendTelegram(text),
            sendEmail({name, phone, comment})
        ])

        res.json({message: 'OK'})
    } catch (e) {
        console.error('Callback error:', e)
        res.status(500).json({message: 'Не вдалося відправити'})
    }
})

module.exports = router