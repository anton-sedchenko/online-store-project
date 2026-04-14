const axios = require('axios');
const {sendMail} = require('../mailer.js');

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

const {Cart} = require('../models/models');
async function getCartIdForUser(userId) {
    const cart = await Cart.findOne({where: {userId}});
    return cart?.id || null;
}

// HTML-шаблон листа про замовлення
function renderOrderEmail({
                              orderId,
                              fullName,
                              tel,
                              email,
                              total,
                              shippingHtml,
                              items
                          }) {
    const LOGO_URL = process.env.EMAIL_LOGO_URL || 'https://charivna-craft.com.ua/logo-email.png';

    const itemsRows = items.map((oi, idx) => {
        const name = oi.product.name;
        const code = oi.product.code;
        const qty = oi.quantity;
        const price = oi.product.price;
        const sum= qty * price;

        return `
            <tr>
                <td style="padding:8px 12px;font-size:14px;color:#333;border-bottom:1px solid #eee;">
                    ${idx + 1}.
                </td>
                <td style="padding:8px 12px;font-size:14px;color:#333;border-bottom:1px solid #eee;">
                    <strong>${name}</strong><br/>
                    <span style="font-size:12px;color:#777;">Артикул: ${code}</span>
                </td>
                <td style="padding:8px 12px;font-size:14px;color:#333;text-align:center;border-bottom:1px solid #eee;">
                    ${qty}
                </td>
                <td style="padding:8px 12px;font-size:14px;color:#333;text-align:right;border-bottom:1px solid #eee;">
                    ${price.toFixed(2)}&nbsp;₴
                </td>
                <td style="padding:8px 12px;font-size:14px;color:#333;text-align:right;border-bottom:1px solid #eee;">
                    <strong>${sum.toFixed(2)}&nbsp;₴</strong>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <!DOCTYPE html>
        <html lang="uk">
        <head>
            <meta charset="UTF-8" />
            <title>Замовлення №${orderId} – Charivna Craft</title>
        </head>
        <body style="margin:0;padding:0;background:#f3f0f8;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f0f8;padding:20px 0;">
                <tr>
                    <td align="center">
                        <table cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
                            <!-- Шапка -->
                            <tr>
                                <td style="background:#ffffff;padding:16px 24px;text-align:center;border-bottom:4px solid #6a1b9a;">
                                    ${LOGO_URL ? `
                                        <img src="${LOGO_URL}" alt="Charivna Craft" style="max-width:180px;height:auto;display:block;margin:0 auto;" />
                                    ` : `
                                        <h1 style="margin:0;font-size:22px;color:#6a1b9a;font-weight:600;">Charivna Craft</h1>
                                    `}
                                </td>
                            </tr>

                            <!-- Привітання -->
                            <tr>
                                <td style="padding:24px 24px 8px;">
                                    <p style="margin:0 0 8px;font-size:16px;color:#333;">
                                        Вітаємо, ${fullName}!
                                    </p>
                                    <p style="margin:0 0 4px;font-size:14px;color:#555;">
                                        Дякуємо за замовлення в інтернет-магазині Charivna Craft.
                                    </p>
                                    <p style="margin:0 0 4px;font-size:14px;color:#555;">
                                        Номер вашого замовлення: №${orderId}.
                                    </p>
                                    <p style="margin:0 0 12px;font-size:13px;color:#777;">
                                        Ми зв’яжемося з вами найближчим часом для підтвердження деталей та відправлення посилки.
                                    </p>
                                </td>
                            </tr>

                            <!-- Дані покупця -->
                            <tr>
                                <td style="padding:8px 24px 8px;">
                                    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                                        <tr>
                                            <td style="vertical-align:top;padding:12px 0;">
                                                <h3 style="margin:0 0 6px;font-size:15px;color:#333;">Покупець</h3>
                                                <p style="margin:0;font-size:13px;color:#555;line-height:1.5;">
                                                    <strong>Імʼя:</strong> ${fullName}<br/>
                                                    <strong>Телефон:</strong> ${tel}<br/>
                                                    <strong>Email:</strong> ${email}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Доставка -->
                            <tr>
                                <td style="padding:4px 24px 16px;">
                                    <h3 style="margin:0 0 6px;font-size:15px;color:#333;">Доставка</h3>
                                    <div style="font-size:13px;color:#555;line-height:1.5;">
                                        ${shippingHtml}
                                    </div>
                                </td>
                            </tr>

                            <!-- Товари -->
                            <tr>
                                <td style="padding:8px 24px 0;">
                                    <h3 style="margin:0 0 8px;font-size:15px;color:#333;">Ваші товари</h3>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:0 16px 16px;">
                                    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #eee;">
                                        <thead>
                                            <tr style="background:#faf5ff;">
                                                <th align="left" style="padding:10px 12px;font-size:12px;color:#666;font-weight:600;width:40px;">№</th>
                                                <th align="left" style="padding:10px 12px;font-size:12px;color:#666;font-weight:600;">Товар</th>
                                                <th align="center" style="padding:10px 12px;font-size:12px;color:#666;font-weight:600;width:60px;">К-сть</th>
                                                <th align="right" style="padding:10px 12px;font-size:12px;color:#666;font-weight:600;width:80px;">Ціна</th>
                                                <th align="right" style="padding:10px 12px;font-size:12px;color:#666;font-weight:600;width:90px;">Сума</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${itemsRows}
                                        </tbody>
                                        <tfoot>
                                            <tr style="background:#faf5ff;">
                                                <td colspan="4" style="padding:10px 12px;font-size:14px;color:#333;text-align:right;border-top:1px solid #eee;">
                                                    <strong>Загальна сума:</strong>
                                                </td>
                                                <td style="padding:10px 12px;font-size:16px;color:#6a1b9a;text-align:right;border-top:1px solid #eee;">
                                                    <strong>${total.toFixed(2)}&nbsp;₴</strong>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </td>
                            </tr>

                            <!-- Інфо / нагадування -->
                            <tr>
                                <td style="padding:8px 24px 16px;">
                                    <p style="margin:0 0 6px;font-size:13px;color:#555;">
                                        Якщо ви помітили неточність у даних замовлення - зв'яжіться з нами зручним для Вас способом.
                                    </p>
                                    <p style="margin:0;font-size:13px;color:#555;">
                                        Контакти:<br/>
                                        <strong>Телефон:</strong> +38 (068) 036 15 97<br/>
                                        <strong>Email:</strong> charivna.craft@gmail.com
                                    </p>
                                </td>
                            </tr>

                            <!-- Футер -->
                            <tr>
                                <td style="background:#faf5ff;padding:12px 24px;text-align:center;">
                                    <p style="margin:0 0 4px;font-size:11px;color:#999;">
                                        Ви отримали цей лист, тому що оформили замовлення на сайті 
                                        <a href="https://charivna-craft.com.ua" style="color:#6a1b9a;text-decoration:none;">charivna-craft.com.ua</a>.
                                    </p>
                                    <p style="margin:0;font-size:11px;color:#bbb;">
                                        © ${new Date().getFullYear()} Charivna Craft. Усі права захищено.
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
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
                order,       /* масив позицій (id, quantity...) */
                shipping = null
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
                comments,
                shipping
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

            function shippingText(s) {
                if (!s) return 'Спосіб доставки: не вказано';

                const lines = [];
                lines.push(`Спосіб доставки: ${s.method || '—'}`);
                if (s.service) lines.push(`Служба: ${s.service}`);

                // Нова Пошта (відділення, поштомат або кур’єр)
                if (s.method === 'Нова Пошта') {
                    if (s.city)    lines.push(`Місто: ${s.city.name}`);
                    if (s.branch)  lines.push(`Відділення: №${s.branch.number} — ${s.branch.description}`);
                    if (s.postomat)lines.push(`Поштомат: №${s.postomat.number} — ${s.postomat.description}`);
                    if (s.address) lines.push(`Адреса: ${s.address}`);
                    if (s.map?.address) lines.push(`Адреса на мапі: ${s.map.address}`);
                }

                // Укрпошта
                if (s.method === 'Укрпошта') {
                    if (s.city)    lines.push(`Місто: ${s.city.name}`);
                    if (s.address) lines.push(`Відділення/Адреса: ${s.address}`);
                }

                return lines.join('\n');
            }

            let text = `🆕 *Нове замовлення #${newOrder.id}*\n`;
            text += `👤 Імʼя: ${fullName}\n`;
            text += `📞 Телефон: ${tel}\n`;
            text += `✉️ Email: ${email}\n`;
            text += `🚚 ${shippingText(shipping)}\n`;
            if (comments) text += `💬 Коментар: ${comments}\n`;
            text += `\n🛒 *Товари:*\n`;
            orderItems.forEach((oi, idx) => {
                const name  = oi.product.name;
                const qty   = oi.quantity;
                const price = oi.product.price;
                const code = oi.product.code;
                text += `${idx + 1}. Артикул: ${code} ${name} — ${qty}×${price}₴ = ${qty * price}₴\n`;
            });

            const shippingHtml = (() => {
                if (!shipping) return '<p><strong>Спосіб доставки:</strong> не вказано</p>';
                const parts = [];
                parts.push(`<p><strong>Спосіб доставки:</strong> ${shipping.method || '—'}</p>`);
                if (shipping.service) parts.push(`<p><strong>Служба:</strong> ${shipping.service}</p>`);

                if (shipping.method === 'Нова Пошта') {
                    if (shipping.city) parts.push(`<p><strong>Місто:</strong> ${shipping.city.name}</p>`);
                    if (shipping.branch) parts.push(
                        `<p><strong>Відділення:</strong> №${shipping.branch.number} — ${shipping.branch.description}</p>`
                    );
                    if (shipping.postomat) parts.push(
                        `<p><strong>Поштомат:</strong> №${shipping.postomat.number} — ${shipping.postomat.description}</p>`
                    );
                    if (shipping.address) parts.push(`<p><strong>Адреса:</strong> ${shipping.address}</p>`);
                    if (shipping.map?.address) parts.push(`<p><strong>Адреса на мапі:</strong> ${shipping.map.address}</p>`);
                    if (shipping.map?.url) parts.push(`<p><a href="${shipping.map.url}">Посилання на мапу</a></p>`);
                }

                if (shipping.method === 'Укрпошта') {
                    if (shipping.city) parts.push(`<p><strong>Місто:</strong> ${shipping.city.name}</p>`);
                    if (shipping.address) parts.push(`<p><strong>Відділення/Адреса:</strong> ${shipping.address}</p>`);
                }

                return parts.join('');
            })();

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
                console.error('Telegram send error:', tgErr?.response?.data || tgErr?.message || tgErr);
            }

            const total = orderItems.reduce(
                (sum, oi) => sum + oi.quantity * oi.product.price,
                0
            );

            // ВАЖЛИВО: shippingHtml ми вже побудували вище
            const mailHtml = renderOrderEmail({
                orderId: newOrder.id,
                fullName,
                tel,
                email,
                total,
                shippingHtml,
                items: orderItems
            });

            sendMail({
                from: process.env.EMAIL_FROM,
                to: [email, process.env.NOTIFY_EMAIL || 'charivna.craft@gmail.com'],
                subject: `Ваше замовлення №${newOrder.id} оформлено`,
                html: mailHtml,
            }).catch(err => {
                console.error('Email send error:', err?.message || err);
            });

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
