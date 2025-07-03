const uuid = require('uuid');
const {Product} = require('../models/models');
const ApiError = require('../error/ApiError');
const cloudinary = require('../utils/cloudinary');

class ProductController {
    async create(req, res, next) {
        try {
            if (!req.files || !req.files.img) {
                return res.status(400).json({ message: 'Файл не завантажений' });
            }

            let { name, price, typeId, description, code } = req.body;

            if (!code) {
                return next(ApiError.badRequest("Необхідно вказати код товару"));
            }

            const { img } = req.files;

            console.log('🟢 create() викликано');
            console.log('📂 Cloudinary завантаження з:', img.tempFilePath);

            const result = await cloudinary.uploader.upload(img.tempFilePath, {
                folder: 'products',
            });

            const imgUrl = result.secure_url;

            const newProduct = await Product.create({
                name,
                price,
                typeId,
                description,
                code,
                img: imgUrl,
            });

            return res.json(newProduct);
        } catch (e) {
            console.error("❌ Cloudinary upload error:", e);
            next(ApiError.internal("Помилка при створенні товару"));
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
                const result = await cloudinary.uploader.upload(img.tempFilePath || img.path, {
                    folder: 'products',
                });
                product.img = result.secure_url;
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
