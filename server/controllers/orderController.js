const axios = require('axios');
const {
    Order,
    OrderFigure,
    CartFigure,
    Figure,
    User
} = require('../models/models');
const ApiError = require('../error/ApiError');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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
                const figureId = item.figureId ?? item.id;
                await OrderFigure.create({
                    orderId: newOrder.id,
                    figureId,
                    quantity: item.quantity
                });
            }
            // Якщо користувач залогінений очищаємо кошик
            if (userId) {
                await CartFigure.destroy({where: {cartId: userId}});
            }

            const orderItems = await OrderFigure.findAll({
                where: {orderId: newOrder.id},
                include: [{model: Figure, attributes: ["name", "price", "code"]}]
            });

            let text = `🆕 *Нове замовлення #${newOrder.id}*\n`;
            text += `👤 Імʼя: ${fullName}\n`;
            text += `📞 Телефон: ${tel}\n`;
            text += `✉️ Email: ${email}\n`;
            if (comments) text += `💬 Коментар: ${comments}\n`;
            text += `\n🛒 *Товари:*\n`;
            orderItems.forEach((oi, idx) => {
                const name  = oi.figure.name;
                const qty   = oi.quantity;
                const price = oi.figure.price;
                const code = oi.figure.code;
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

            return res.status(201).json({
                message: 'Замовлення оформлено',
                orderId: newOrder.id,
                fullName, tel, email, comments
            });
        } catch (e) {
            console.error('💥 createOrder crashed:', e);
            next(ApiError.internal(e.message));
        }
    }

    // Історія замовлень для поточного користувача
    async getMyOrders(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({
                where: {userId},
                include: [{
                    model: OrderFigure,
                    include: [{model: Figure}]
                }]
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
            // одночасно підтягуємо всі записи з order_figures, у яких orderId = id
            // для кожного з них через вкладений include також тягнемо з figures дані про сам товар
            // щоб у відповіді малися назва, ціна, зображення
            const order = await Order.findOne({
                where: {id},
                include: [{
                    model: OrderFigure,
                    include: [{model: Figure}]
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
                        model: OrderFigure,
                        include: [{model: Figure}]
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
