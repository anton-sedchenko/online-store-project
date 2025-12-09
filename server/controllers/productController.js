const {Product} = require('../models/models');
const ApiError = require('../error/ApiError');
const {cloudinary, extractPublicId} = require('../utils/cloudinary');
const slugify = require('slugify');
const {ProductImage} = require('../models/models');
const {invalidateFeedCache} = require('../routes/feed');

class ProductController {
    async getBySlug(req, res, next) {
        const {slug} = req.params;
        const product = await Product.findOne({
            where: {slug},
            include: [{association: 'images'}]
        });
        if (!product) return next(ApiError.notFound('Товар не знайдено'));
        return res.json(product);
    }

    async create(req, res, next) {
        try {
            if (!req.files || !req.files.img) {
                return res.status(400).json({message: 'Файл не завантажений'});
            }

            let {
                name,
                price,
                typeId,
                description,
                code,
                availability,
                rozetkaCategoryId,
                color,
                kind,
            } = req.body;

            // нормалізація статусу (щоб "Під замовлення" не ламало ENUM)
            const availabilityNorm = availability === 'PRE_ORDER' ? 'MADE_TO_ORDER' : availability;

            // парсимо числа
            const typeIdNum  = Number(typeId);
            const priceNum   = Number(price);

            // Rozetka ID може бути порожнім - тоді null
            const rzIdNum = rozetkaCategoryId && String(rozetkaCategoryId).trim() !== ''
                ? Number(rozetkaCategoryId)
                : null;

            if (!name || !code || !typeId || Number.isNaN(typeIdNum) || Number.isNaN(priceNum)) {
                return next(ApiError.badRequest('Заповніть назву, артикул, коректну ціну та категорію'));
            }

            const {img} = req.files;
            const result = await cloudinary.uploader.upload(img.tempFilePath || img.path, {
                folder: 'products',
            });

            const slug = slugify(name, {lower: true, strict: true}) + '-' + code;
            const newProduct = await Product.create({
                name,
                slug,
                price: priceNum,
                typeId: typeIdNum,
                description,
                code,
                availability: availabilityNorm,
                rozetkaCategoryId: rzIdNum,
                img: result.secure_url,
                color: color && color.trim() ? color.trim() : null,
                kind: kind && kind.trim() ? kind.trim() : null,
            });

            invalidateFeedCache();

            return res.json(newProduct);
        } catch (e) {
            console.error('PRODUCT CREATE ERROR:', e);
            next(ApiError.internal("Помилка при створенні товару"));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            let {
                name,
                price,
                typeId,
                description,
                code,
                color,
                kind,
            } = req.body;

            // приймаємо можливі поля
            const {availability, rozetkaCategoryId} = req.body;
            // нормалізація
            const availabilityNorm = availability === 'PRE_ORDER' ? 'MADE_TO_ORDER' : availability;
            // обробка Rozetka ID
            let rzIdNum = null;

            if (rozetkaCategoryId !== undefined) {
                rzIdNum = String(rozetkaCategoryId).trim() === '' ? null : Number(rozetkaCategoryId);
                if (Number.isNaN(rzIdNum)) rzIdNum = null;
            }

            const product = await Product.findByPk(id);

            if (!product) return next(ApiError.badRequest(`Товар ${id} не знайдений`));

            if (availability !== undefined) {
                product.availability = availabilityNorm;
            }

            // якщо прийшов файл - оновлюємо головне зображення
            if (req.files?.img) {
                const {img} = req.files;
                const result = await cloudinary.uploader.upload(img.tempFilePath || img.path, {
                    folder: 'products',
                });
                product.img = result.secure_url;
            }

            // якщо прийшли додаткові фото — зберігаємо їх
            const images = req.files?.images;
            if (images) {
                const filesArray = Array.isArray(images) ? images : [images];
                for (const file of filesArray) {
                    const result = await cloudinary.uploader.upload(file.tempFilePath || file.path, {
                        folder: 'products',
                    });
                    await ProductImage.create({
                        url: result.secure_url,
                        productId: product.id,
                    });
                }
            }

            // оновлюємо інші поля
            if (name) product.name = name;
            if (code) product.code = code;
            if (name || code) {
                product.slug = slugify(product.name, {lower: true, strict: true}) + '-' + product.code;
            }
            if (price !== undefined) {
                const priceNum = Number(price);
                if (!Number.isNaN(priceNum)) product.price = priceNum;
            }
            if (typeId !== undefined) {
                const typeIdNum = Number(typeId);
                if (!Number.isNaN(typeIdNum)) product.typeId = typeIdNum;
            }
            if (description !== undefined) product.description = description;

            if (rozetkaCategoryId !== undefined) {
                product.rozetkaCategoryId = rzIdNum; // дозволяємо і ставити null, і число
            }

            if (color !== undefined) {
                product.color = color && color.trim() ? color.trim() : null;
            }

            if (kind !== undefined) {
                product.kind = kind && kind.trim() ? kind.trim() : null;
            }

            await product.save();
            invalidateFeedCache();
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
                products = await Product.findAndCountAll({
                    where: { typeId },
                    limit,
                    offset,
                    order: [['code', 'ASC']], // Сортування по коду товару
                });
            } else {
                products = await Product.findAndCountAll({
                    limit,
                    offset,
                    order: [['code', 'ASC']],
                });
            }

            return res.json(products);
        } catch (e) {
            next(ApiError.internal('Помилка при отриманні товарів'));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const product = await Product.findByPk(id, {
                include: [{association: 'images'}]
            });
            if (!product) return next(ApiError.notFound("Товар не знайдено"));
            return res.json(product);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const {id} = req.params;
            const product = await Product.findByPk(id, {include: [{association: 'images'}]});
            if (!product) {
                return next(ApiError.badRequest(`Товар з id=${id} не знайдений`));
            }

            // Видаляємо додаткові зображення з Cloudinary
            for (const image of product.images) {
                const publicId = extractPublicId(image.url);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            // Видаляємо головне зображення, якщо є
            const mainPublicId = extractPublicId(product.img);
            if (mainPublicId) {
                await cloudinary.uploader.destroy(mainPublicId);
            }

            // Видаляємо всі записи
            await ProductImage.destroy({where: {productId: id}});
            await Product.destroy({where: {id}});

            return res.json({ message: `Товар id=${id} та всі зображення видалені` });
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async addImages(req, res, next) {
        try {
            const {productId} = req.body;
            if (!productId) return next(ApiError.badRequest('Не передано productId'));

            const product = await Product.findByPk(productId);
            if (!product) return next(ApiError.badRequest('Товар не знайдено'));

            const files = req.files?.images;
            if (!files) return next(ApiError.badRequest('Файли не передані'));

            const uploaded = [];

            const filesArray = Array.isArray(files) ? files : [files]; // якщо одне зображення
            for (const file of filesArray) {
                const result = await cloudinary.uploader.upload(file.tempFilePath || file.path, {
                    folder: 'products',
                });
                const image = await ProductImage.create({
                    url: result.secure_url,
                    productId: product.id
                });
                uploaded.push(image);
            }

            return res.json(uploaded);
        } catch (e) {
            console.error(e);
            next(ApiError.internal('Помилка при додаванні зображень'));
        }
    }

    async deleteImage(req, res, next) {
        try {
            const {id} = req.params;
            const image = await ProductImage.findByPk(id);
            if (!image) return next(ApiError.notFound('Зображення не знайдено'));

            // Отримуємо public_id з URL та видаляємо з клаудінарі
            const publicId = extractPublicId(image.url);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }

            // Видаляємо запис з БД
            await ProductImage.destroy({where: {id}});

            return res.json({message: 'Зображення видалено'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new ProductController();
