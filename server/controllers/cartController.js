const {Cart, CartProduct, Product} = require('../models/models');
const ApiError = require('../error/ApiError');

class CartController {
    // додає/оновлює позицію в кошику
    async addToCart(req, res, next) {
        try {
            const userId = req.user.id;
            const {productId, quantity = 1} = req.body;

            // Перевіряємо чи вже є така позиція в кошику
            const existing = await CartProduct.findOne({where: {cartId: userId, productId}});
            if (existing) {
                existing.quantity += quantity;
                await existing.save();
                return res.json(existing);
            }

            // Інакше створюємо новий запис
            const cartItem = await CartProduct.create({
                cartId: userId,
                productId,
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
            const items = await CartProduct.findAll({
                where: {cartId: userId},
                include: [{model: Product}] // через include: [Product] Sequelize автоматично підтягує для кожного
                // елементу дані з таблиці product (тобто маємо об’єкт Product у відповіді з name, price, img)
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
            const {cartProductId} = req.params;
            await CartProduct.destroy({where: {cartId: userId, id: cartProductId}});
            return res.json({message: 'Товар видалено з кошика'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // Очистити весь кошик
    async clearCart(req, res, next) {
        try {
            const userId = req.user.id;
            await CartProduct.destroy({where: {cartId: userId}});
            return res.json({message: 'Кошик очищений'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async updateItem(req, res, next) {
        try {
            const userId = req.user.id;
            const {productId} = req.params;
            const {quantity} = req.body;
            const item = await CartProduct.findOne({
                where: {cartId: userId, productId}
            });
            if (!item) return next(ApiError.badRequest("Позиція не знайдена"));
            item.quantity = quantity;
            await item.save();
            return res.json(item);
        } catch(e) {
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
            const {cartId, productId, quantity = 1} = req.body;
            // перевіряємо чи валідний cartId
            const cart = await Cart.findByPk(cartId);
            if (!cart) return next(ApiError.badRequest('Невірний Id кошика'));

            // Перевіряємо чи є вже така позиція в кошику
            const existing = await CartProduct.findOne({where: {cartId, productId}});
            if (existing) {
                existing.quantity += quantity;
                await existing.save();
                return res.json(existing);
            }

            const cartItem = await CartProduct.create({cartId, productId, quantity});
            return res.status(201).json(cartItem);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getGuestCart(req, res, next) {
        try {
            const {cartId} = req.query;
            const items = await CartProduct.findAll({
                where: {cartId},
                include: [{model: Product}]
            });
            return res.json(items);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async removeFromCartGuest(req, res, next) {
        try {
            const {cartId, productId} = req.body;
            await CartProduct.destroy({where: {cartId, productId}});
            return res.json({message: 'Товар видалено з кошика'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async clearGuestCart(req, res, next) {
        try {
            const {cartId} = req.body;
            await CartProduct.destroy({where: {cartId}});
            return res.json({message: 'Кошик очищено'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new CartController();
