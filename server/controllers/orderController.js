const { Order, OrderFigure, CartFigure, Figure, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    async createOrder(req, res, next) {
        try {
            const userId = req.user ? req.user.id : null;
            // Якщо це гість — беремо кошик з тіла запиту
            let items = userId
                ? await CartFigure.findAll({where: {cartId: userId}})
                : req.body.items;

            if (!items || items.length === 0) {
                return next(ApiError.badRequest('Немає товарів для оформлення замовлення'));
            }

            // Створюємо сам Order
            const order = await Order.create({userId});

            // Для кожного item копіюємо в OrderFigure
            for (const item of items) {
                // у разі авторизованого юзера беремо поля figureId і quantity з CartFigure
                // якщо ні, то items берем з тіла ріквеста
                const figureId = userId ? item.figureId : item.figureId;
                const quantity = userId ? item.quantity : item.quantity;
                await OrderFigure.create({ orderId: order.id, figureId, quantity });
            }

            // Якщо користувач залогінений очищаємо кошик
            if (userId) {
                await CartFigure.destroy({where: {cartId: userId}});
            }

            return res.status(201).json({message: 'Замовлення оформлено', orderId: order.id});
        } catch (e) {
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

    // POST /api/order/guest-cart
    async createOrderFromGuestCart(req, res, next) {
        try {
            const {cartId} = req.body;
            if (!cartId) {
                return next(ApiError.badRequest('Не передано Id кошика'));
            }

            // Забираємо всі товари з гостьового кошика
            const items = await CartFigure.findAll({where: {cartId}});
            if (!items.length) {
                return next(ApiError.badRequest('Кошик порожній або невірний Id кошика'));
            }

            // Створюємо саме замовлення
            const order = await Order.create({userId: null});

            // Копіюємо кожну позицію
            for (const it of items) {
                await OrderFigure.create({
                    orderId: order.id,
                    figureId: it.figureId,
                    quantity: it.quantity
                });
            }

            // Очищаємо кошик
            await CartFigure.destroy({where: {cartId}});

            return res.status(201).json({
                message: 'Замовлення (гість) оформлено',
                orderId: order.id
            });
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new OrderController();
