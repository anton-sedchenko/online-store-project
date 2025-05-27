const {Cart, CartFigure, Figure} = require('../models/models');
const ApiError = require('../error/ApiError');

class CartController {
    // додає/оновлює позицію в кошику
    async addToCart(req, res, next) {
        try {
            const userId = req.user.id;
            const {figureId, quantity = 1} = req.body;

            // Перевіряємо чи вже є така позиція в кошику
            const existing = await CartFigure.findOne({where: {cartId: userId, figureId}});
            if (existing) {
                existing.quantity += quantity;
                await existing.save();
                return res.json(existing);
            }

            // Інакше створюємо новий запис
            const cartItem = await CartFigure.create({
                cartId: userId,
                figureId,
                quantity
            });
            return res.status(201).json(cartItem);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // Повертає вміст кошика разом з даними про товари
    async getCart(req, res, next) {
        try {
            const userId = req.user.id;
            const items = await CartFigure.findAll({
                where: {cartId: userId},
                include: [{model: Figure}] // через include: [Figure] Sequelize автоматично підтягує для кожного
                // елементу дані з таблиці figure (тобто маємо об’єкт Figure у відповіді з name, price, img)
                // і повертаємо масив таких елементів
            });
            return res.json(items);
        } catch(e) {
            next(ApiError.internal(e.message));
        }
    }

    // Видалити одну позицію
    async removeFromCart(req, res, next) {
        try {
            const userId = req.user.id;
            const {figureId} = req.body;
            await CartFigure.destroy({where: {cartId: userId, figureId}});
            return res.json({message: 'Товар видалено з кошика'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // Очистити весь кошик
    async clearCart(req, res, next) {
        try {
            const userId = req.user.id;
            await CartFigure.destroy({where: {cartId: userId}});
            return res.json({message: 'Кошик очищений'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // Гостьовий кошик
    async initGuestCart(req, res, next) {
        try {
            const cart = await Cart.create();
            return res.json({cartId: cart.id});
        } catch(e) {
            next(ApiError.internal(e.message));
        }
    }

    async addToCartGuest(req, res, next) {
        try {
            const {cartId, figureId, quantity = 1} = req.body;
            // перевіряємо чи валідний cartId
            const cart = await Cart.findByPk(cartId);
            if (!cart) return next(ApiError.badRequest('Невірний Id кошика'));

            // Перевіряємо чи є вже така позиція в кошику
            const existing = await CartFigure.findOne({where: {cartId, figureId}});
            if (existing) {
                existing.quantity += quantity;
                await existing.save();
                return res.json(existing);
            }

            const cartItem = await CartFigure.create({cartId, figureId, quantity});
            return res.status(201).json(cartItem);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getGuestCart(req, res, next) {
        try {
            const {cartId} = req.query;
            const items = await CartFigure.findAll({
                where: {cartId},
                include: [{model: Figure}]
            });
            return res.json(items);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async removeFromCartGuest(req, res, next) {
        try {
            const {cartId, figureId} = req.body;
            await CartFigure.destroy({where: {cartId, figureId}});
            return res.json({message: 'Товар видалено з кошика'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async clearGuestCart(req, res, next) {
        try {
            const {cartId} = req.body;
            await CartFigure.destroy({where: {cartId}});
            return res.json({message: 'Кошик очищено'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new CartController();
