const axios = require('axios');
const nodemailer = require('nodemailer');

const {
    Order,
    OrderProduct,
    CartProduct,
    Product,
    User
} = require('../models/models');
const ApiError = require('../error/ApiError');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// транспортер для відправки пошти
const mailer = nodemailer.createTransport({
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

const {Cart} = require('../models/models');
async function getCartIdForUser(userId) {
    const cart = await Cart.findOne({where: {userId}});
    return cart?.id || null;
}

class OrderController {
    async createOrder(req, res, next) {
        try {
            // якщо токен був, то в optionalAuth він попав req.user.id
            const userId = req.user?.id || null;
            const {
                fullName,
                tel,
                email,
                comments,
                order       /* масив позицій (id, quantity...) */
            } = req.body;

            if (!order?.length) {
                return next(ApiError.badRequest('Немає товарів для оформлення замовлення'));
            }

            // Створюємо саме замовлення з усіма полями в таблиці
            const newOrder = await Order.create({
                userId,  // або null якщо юзер не авторизований
                fullName,
                tel,
                email,
                comments
            });

            // Додаємо позиції
            for (const item of order) {
                // у гостя в item.id лежить id фігурки додаєм його,
                // щоб замовлення не зламались через порожнє поле
                const productId = item.productId ?? item.id;
                await OrderProduct.create({
                    orderId: newOrder.id,
                    productId,
                    quantity: item.quantity
                });
            }
            // Якщо користувач залогінений очищаємо кошик
            if (userId) {
                const cartId = await getCartIdForUser(userId);
                if (cartId) await CartProduct.destroy({where: {cartId}});
            }

            const orderItems = await OrderProduct.findAll({
                where: {orderId: newOrder.id},
                include: [{model: Product, attributes: ["name", "price", "code"]}]
            });

            let text = `🆕 *Нове замовлення #${newOrder.id}*\n`;
            text += `👤 Імʼя: ${fullName}\n`;
            text += `📞 Телефон: ${tel}\n`;
            text += `✉️ Email: ${email}\n`;
            if (comments) text += `💬 Коментар: ${comments}\n`;
            text += `\n🛒 *Товари:*\n`;
            orderItems.forEach((oi, idx) => {
                const name  = oi.product.name;
                const qty   = oi.quantity;
                const price = oi.product.price;
                const code = oi.product.code;
                text += `${idx + 1}. Артикул: ${code} ${name} — ${qty}×${price}₴ = ${qty * price}₴\n`;
            });

            try {
                await axios.post(
                    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
                    {
                        chat_id: TELEGRAM_CHAT_ID,
                        text: text,
                        parse_mode: 'Markdown'
                    }
                );
            } catch (tgErr) {
                console.error('Telegram send error:', tgErr.message);
            }

            const htmlItems = orderItems.map((oi, idx) => {
                return `<li>${idx + 1}. ${oi.product.name} (артикул ${oi.product.code}) — ${oi.quantity}×${oi.product.price}₴ = ${oi.quantity * oi.product.price}₴</li>`;
            }).join('');

            const mailHtml = `
                <h2>Дякуємо за замовлення в інтернет-магазині Charivna Craft!</h2>
                <p>Покупець:</p>
                <p><strong>Імʼя:</strong> ${fullName}<br>
                   <strong>Телефон:</strong> ${tel}<br>
                   <strong>Email:</strong> ${email}
                </p>
                <h3>Ваші товари:</h3>
                <ul>${htmlItems}</ul>
                <p><strong>Загальна сума:</strong> ${orderItems.reduce((sum, oi) => sum + oi.quantity * oi.product.price, 0)}₴</p>
                <p>Ми зв’яжемося з вами найближчим часом для підтвердження замовлення.</p>
            `;

            try {
                // просто перевірка з’єднання
                await mailer.verify();

                await mailer.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: [email, 'charivna.craft@gmail.com'],
                    subject: 'Ваше замовлення оформлено',
                    html: mailHtml,
                });
            } catch (mailErr) {
                console.error('Email send error:', mailErr?.message || mailErr);
                // не кидаємо помилку – замовлення вже створене, просто лог.
            }

            return res.status(201).json({
                message: 'Замовлення оформлено, лист відправлено',
                orderId: newOrder.id,
                fullName, tel, email, comments
            });
        } catch (e) {
            console.error('createOrder crashed:', e.stack || e);
            return next(ApiError.internal('Помилка на сервері при створенні замовлення'));
        }
    }

    // Історія замовлень для поточного користувача
    async getMyOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: {userId},
                include: [{
                    model: OrderProduct,
                    include: [{model: Product}]
                }],
                order: [['createdAt', 'DESC']]
            });
            return res.json(orders);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // Перегляд конкретного замовлення (лише свого або адміністр.)
    async getOneOrder(req, res, next) {
        try {
            const {id} = req.params;
            // шукаємо в таблиці orders рядок з id, який ми отримали.
            // одночасно підтягуємо всі записи з order_products, у яких orderId = id
            // для кожного з них через вкладений include також тягнемо з products дані про сам товар
            // щоб у відповіді малися назва, ціна, зображення
            const order = await Order.findOne({
                where: {id},
                include: [{
                    model: OrderProduct,
                    include: [{model: Product}]
                }]
            });
            if (!order) return next(ApiError.badRequest('Замовлення не знайдено'));
            return res.json(order);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // GET /api/order/all — всі замовлення тільки для адміна
    async getAllOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                // Підтягуємо одразу і користувача і товари в кожному замовленні
                include: [
                    { model: User, attributes: ['id', 'email']}, // обмежуємо поля юзера від паролів
                    {
                        model: OrderProduct,
                        include: [{model: Product}]
                    }
                ],
                order: [['createdAt', 'DESC']] // сортування за датою
            });
            return res.json(orders);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new OrderController();
