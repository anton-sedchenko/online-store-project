const uuid = require('uuid');
const path = require('path');
const {Product} = require('../models/models');
const ApiError = require('../error/ApiError');

class ProductController {
    async create(req, res, next) {
        try {
            if (!req.files || !req.files.img) {
                return res.status(400).json({ message: 'Файл не завантажений' });
            }
            let {name, price, typeId, description, code} = req.body;
            if (!code) {
                return next(ApiError.badRequest("Необхідно вказати код товару"));
            }
            const {img} = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const newProduct = await Product.create(
                {name, price, typeId, description, img: fileName, code}
            );

            return res.json(newProduct);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            let {name, price, typeId, description, code} = req.body;
            const product = await Product.findByPk(id);
            if (!product) return next(ApiError.badRequest(`Товар ${id} не знайдений`));

            // якщо прийшов файл - оновлюємо картинку
            if (req.files?.img) {
                const {img} = req.files;
                const fileName = uuid.v4() + path.extname(img.name);
                await img.mv(path.resolve(__dirname, '..', 'static', fileName));
                product.img = fileName;
            }

            // оновлюємо інші поля
            if (name) product.name = name;
            if (price) product.price = price;
            if (typeId) product.typeId = typeId;
            if (description !== undefined) product.description = description;
            if (code) product.code = code;

            await product.save();
            return res.json(product);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {typeId, limit, page} = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;
            let products;

            if (typeId) {
                products = await Product.findAndCountAll({where: {typeId}, limit, offset});
            } else {
                products = await Product.findAndCountAll({limit, offset});
            }

            return res.json(products);
        } catch (e) {
            next(ApiError.internal('Помилка при отриманні товарів'));
        }
    }

    async getOne(req, res) {
        const {id} = req.params;
        const product = await Product.findByPk(id);
        return res.json(product);
    }

    async deleteProduct(req, res, next) {
        try {
            const {id} = req.params;
            const product = await Product.findByPk(id); // Знаходимо в БД об'єкт фігурки
            if (!product) {
                return next(ApiError.badRequest(`Товар з id=${id} не знайдений`));
            }
            await Product.destroy({where: {id}});
            return res.json({message: `Товар id=${id} успішно видалений`});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new ProductController();
