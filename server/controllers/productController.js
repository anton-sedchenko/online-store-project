const {Product} = require('../models/models');
const ApiError = require('../error/ApiError');
const {cloudinary, extractPublicId} = require('../utils/cloudinary');
const slugify = require('slugify');
const {ProductImage} = require('../models/models');

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

            let {name, price, typeId, description, code} = req.body;

            if (!code) {
                return next(ApiError.badRequest('Необхідно вказати код товару'));
            }

            const {img} = req.files;
            const result = await cloudinary.uploader.upload(img.tempFilePath, {
                folder: 'products',
            });

            const slug = slugify(name, {lower: true, strict: true}) + '-' + code;
            const newProduct = await Product.create({
                name,
                slug,
                price,
                typeId,
                description,
                code,
                img: result.secure_url,
            });

            return res.json(newProduct);
        } catch (e) {
            next(ApiError.internal("Помилка при створенні товару"));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            let {name, price, typeId, description, code} = req.body;
            const product = await Product.findByPk(id);
            if (!product) return next(ApiError.badRequest(`Товар ${id} не знайдений`));

            // якщо прийшов файл - оновлюємо головне зображення
            if (req.files?.img) {
                const {img} = req.files;
                const result = await cloudinary.uploader.upload(img.tempFilePath || img.path, {
                    folder: 'products',
                });
                product.img = result.secure_url;
            }

            // 🆕 якщо прийшли додаткові фото — зберігаємо їх
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
            if (price) product.price = price;
            if (typeId) product.typeId = typeId;
            if (description !== undefined) product.description = description;

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
