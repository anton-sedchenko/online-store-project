const {Cart, CartProduct, Product} = require('../models/models');
const ApiError = require('../error/ApiError');

const PURCHASABLE_AVAILABILITIES = new Set(['IN_STOCK', 'MADE_TO_ORDER']);

function isPositiveQuantity(quantity) {
    return Number.isFinite(Number(quantity)) && Number(quantity) > 0;
}

async function validateProductForCart(productId, quantity) {
    if (!isPositiveQuantity(quantity)) {
        throw ApiError.badRequest('Кількість товару має бути додатним числом');
    }

    const product = await Product.findByPk(productId);
    if (!product) {
        throw ApiError.badRequest('Товар не знайдено');
    }

    if (!PURCHASABLE_AVAILABILITIES.has(product.availability)) {
        throw ApiError.badRequest('Товар недоступний для додавання в кошик');
    }

    return product;
}

async function getCartIdForUser(userId) {
    const cart = await Cart.findOne({where: {userId}});
    if (!cart) throw ApiError.internal('Кошик користувача не знайдено');
    return cart.id;
}

class CartController {
    // додає/оновлює позицію в кошику
    async addToCart(req, res, next) {
        try {
            const userId = req.user.id;
            const {productId, quantity = 1} = req.body;
            const quantityNum = Number(quantity);

            await validateProductForCart(productId, quantityNum);

            // Перевіряємо чи вже є така позиція в кошику
            const cartId = await getCartIdForUser(userId);
            const existing = await CartProduct.findOne({where: {cartId, productId}});
            if (existing) {
                existing.quantity += quantityNum;
                await existing.save();
                return res.json(existing);
            }

            // Інакше створюємо новий запис
            const cartItem = await CartProduct.create({cartId, productId, quantity: quantityNum});

            return res.status(201).json(cartItem);
        } catch (e) {
            next(e.status ? e : ApiError.internal(e.message));
        }
    }

    // Повертає вміст кошика разом з даними про товари
    async getCart(req, res, next) {
        try {
            const userId = req.user.id;
            const cartId = await getCartIdForUser(userId);
            const items = await CartProduct.findAll({
                where: {cartId},
                include: [{model: Product}]
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
            const cartId = await getCartIdForUser(userId);
            await CartProduct.destroy({where: {cartId, id: cartProductId}});
            return res.json({message: 'Товар видалено з кошика'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // Очистити весь кошик
    async clearCart(req, res, next) {
        try {
            const userId = req.user.id;
            const cartId = await getCartIdForUser(userId);
            await CartProduct.destroy({where: {cartId}});
            return res.json({message: 'Кошик очищений'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async updateItem(req, res, next) {
        try {
            const userId = req.user.id;
            const {cartProductId} = req.params;
            const {quantity} = req.body;

            const cartId = await getCartIdForUser(userId);
            const item = await CartProduct.findOne({where: {id: cartProductId, cartId}});
            if (!item) return next(ApiError.badRequest("Позиція не знайдена"));

            item.quantity = quantity;
            await item.save();
            return res.json(item);
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
            const {cartId, productId, quantity = 1} = req.body;
            const quantityNum = Number(quantity);

            await validateProductForCart(productId, quantityNum);

            // перевіряємо чи валідний cartId
            const cart = await Cart.findByPk(cartId);
            if (!cart) return next(ApiError.badRequest('Невірний Id кошика'));

            // Перевіряємо чи є вже така позиція в кошику
            const existing = await CartProduct.findOne({where: {cartId, productId}});
            if (existing) {
                existing.quantity += quantityNum;
                await existing.save();
                return res.json(existing);
            }

            const cartItem = await CartProduct.create({cartId, productId, quantity: quantityNum});
            return res.status(201).json(cartItem);
        } catch (e) {
            next(e.status ? e : ApiError.internal(e.message));
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
