const {Resend} = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Уніфікована функція відправки листів
async function sendMail({from, to, subject, html}) {
    try {
        const response = await resend.emails.send({
            from: from || process.env.EMAIL_FROM,
            to, // може бути string або масив
            subject,
            html,
        });

        console.log('Resend email sent, id:', response?.data?.id || '(no id)');
        return response;
    } catch (err) {
        console.error('Resend email error:', err?.message || err);
        throw err;
    }
}

module.exports = {sendMail};