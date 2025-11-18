const Router = require('express')
const router = new Router()
const {sendMail} = require('../mailer.js');

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
function sendEmail({ name, phone, comment }) {
    const html = `
        <h3>Замовлення зворотного дзвінка</h3>
        <p><strong>Імʼя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        ${comment ? `<p><strong>Коментар:</strong><br/>${comment}</p>` : ''}
    `;

    // без try/catch — ми не чекаємо результату
    sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.NOTIFY_EMAIL,
        subject: 'Нове замовлення зворотнього дзвінка',
        html,
    }).catch(err => {
        console.error('Callback email error:', err?.message || err);
    });
}

router.post('/', async (req, res) => {
    try {
        const {name, phone, comment = ''} = req.body;

        if (!name?.trim() || !phone?.trim()) {
            return res.status(400).json({ message: 'Імʼя і телефон обов’язкові' });
        }

        const text = `🔔 *Замовлення зворотнього дзвінка*\n` +
            `Імʼя: _${name}_\nТелефон: _${phone}_` +
            (comment ? `\nКоментар: _${comment}_` : '');

        // ТЕЛЕГРАМ чекаємо (він швидкий)
        await sendTelegram(text);

        // А ПОШТУ — на фоні
        sendEmail({name, phone, comment});

        // Відповідь відправляємо одразу
        res.json({message: 'OK'});
    } catch (e) {
        console.error('Callback error:', e);
        res.status(500).json({message: 'Не вдалося відправити'});
    }
});

module.exports = router