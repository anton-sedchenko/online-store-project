const sequelize = require('../db');
const {Product, ProductImage, ProductMarketplaceParam} = require('../models/models');
const ApiError = require('../error/ApiError');
const {cloudinary, extractPublicId} = require('../utils/cloudinary');
const slugify = require('slugify');
const {invalidateFeedCache} = require('../routes/feed');

const ALLOWED_AVAILABILITIES = new Set(['IN_STOCK', 'MADE_TO_ORDER', 'OUT_OF_STOCK']);

function normalizeAvailability(value, defaultValue) {
    if (value === undefined) return defaultValue;
    const normalized = value === 'PRE_ORDER' ? 'MADE_TO_ORDER' : value;

    if (!ALLOWED_AVAILABILITIES.has(normalized)) {
        throw ApiError.badRequest('Некоректний статус наявності товару');
    }

    return normalized;
}

const PRODUCT_INCLUDES = [
    {association: 'images'},
    {association: 'marketplaceParams'},
];

function parseMarketplaceParams(raw) {
    if (!raw) return [];

    let parsed = raw;

    if (typeof raw === 'string') {
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    if (!Array.isArray(parsed)) return [];

    return parsed
        .map((item) => ({
            marketplace: String(item.marketplace || 'rozetka').trim() || 'rozetka',
            name: String(item.name || '').trim(),
            value: String(item.value || '').trim(),
        }))
        .filter((item) => item.name && item.value);
}

async function syncMarketplaceParams(productId, rawParams, transaction) {
    if (rawParams === undefined) return;

    const params = parseMarketplaceParams(rawParams);

    await ProductMarketplaceParam.destroy({
        where: {
            productId,
            marketplace: 'rozetka',
        },
        transaction,
    });

    if (!params.length) return;

    await ProductMarketplaceParam.bulkCreate(
        params.map((item) => ({
            productId,
            marketplace: item.marketplace,
            name: item.name,
            value: item.value,
        })),
        {transaction}
    );
}

class ProductController {
    async getBySlug(req, res, next) {
        try {
            const {slug} = req.params;
            const product = await Product.findOne({
                where: {slug},
                include: PRODUCT_INCLUDES,
            });
            if (!product) return next(ApiError.notFound('Товар не знайдено'));
            return res.json(product);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async create(req, res, next) {
        const uploadedAssets = [];
        let transactionCommitted = false;

        const cleanupUploadedAssets = async () => {
            if (!uploadedAssets.length) return;

            const cleanupResults = await Promise.allSettled(
                uploadedAssets.map(asset => cloudinary.uploader.destroy(asset.public_id))
            );

            cleanupResults.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error('PRODUCT CREATE CLOUDINARY CLEANUP ERROR:', {
                        publicId: uploadedAssets[index]?.public_id,
                        error: result.reason,
                    });
                }
            });
        };

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
                rating,
                color,
                kind,
                shape,
                purpose,
                features,
                width,
                length,
                height,
                diameter,
                weightKg,
                country,
                material,
                marketplaceParams,
            } = req.body;

            const availabilityNorm = normalizeAvailability(availability, 'IN_STOCK');
            const defaultTypeId = Number(process.env.DEFAULT_TYPE_ID);

            const typeIdNum =
                typeId !== undefined && String(typeId).trim() !== ''
                    ? Number(typeId)
                    : defaultTypeId;

            const priceNum = Number(price);
            const ratingNum = Math.min(10, Math.max(1, Number(rating ?? 1)));

            const rzIdNum =
                rozetkaCategoryId && String(rozetkaCategoryId).trim() !== ''
                    ? Number(rozetkaCategoryId)
                    : null;

            const widthVal = width && String(width).trim() ? String(width).trim() : null;
            const lengthVal = length && String(length).trim() ? String(length).trim() : null;
            const heightVal = height && String(height).trim() ? String(height).trim() : null;
            const diameterVal = diameter && String(diameter).trim() ? String(diameter).trim() : null;
            const materialVal = material && String(material).trim() ? String(material).trim() : null;
            const colorVal = color && String(color).trim() ? String(color).trim() : null;
            const kindVal = kind && String(kind).trim() ? String(kind).trim() : null;
            const shapeVal = shape && String(shape).trim() ? String(shape).trim() : null;
            const purposeVal = purpose && String(purpose).trim() ? String(purpose).trim() : null;
            const featuresVal = features && String(features).trim() ? String(features).trim() : null;
            const countryVal = country && String(country).trim() ? String(country).trim() : 'Україна';

            const weightRaw = weightKg !== undefined ? String(weightKg).trim() : '';
            const weightNum = weightRaw === '' ? null : Number(weightRaw.replace(',', '.'));
            const weightVal = Number.isNaN(weightNum) ? null : weightNum;

            if (!name || !code || Number.isNaN(typeIdNum) || Number.isNaN(priceNum)) {
                return next(ApiError.badRequest('Заповніть назву, артикул і коректну ціну'));
            }

            const {img, images} = req.files;
            const additionalFiles = !images
                ? []
                : Array.isArray(images)
                    ? images
                    : [images];

            const mainImageResult = await cloudinary.uploader.upload(img.tempFilePath || img.path, {
                folder: 'products',
            });
            uploadedAssets.push({
                secure_url: mainImageResult.secure_url,
                public_id: mainImageResult.public_id,
            });

            const additionalImageResults = [];
            for (const file of additionalFiles) {
                const result = await cloudinary.uploader.upload(file.tempFilePath || file.path, {
                    folder: 'products',
                });
                const uploadedAsset = {
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                };
                uploadedAssets.push(uploadedAsset);
                additionalImageResults.push(uploadedAsset);
            }

            const slug = slugify(name, {lower: true, strict: true}) + '-' + code;

            const createdProductId = await sequelize.transaction(async (transaction) => {
                const newProduct = await Product.create({
                    name,
                    slug,
                    price: priceNum,
                    typeId: typeIdNum,
                    description,
                    code,
                    availability: availabilityNorm,
                    rozetkaCategoryId: rzIdNum,
                    img: mainImageResult.secure_url,
                    color: colorVal,
                    kind: kindVal,
                    shape: shapeVal,
                    purpose: purposeVal,
                    features: featuresVal,
                    rating: Number.isNaN(ratingNum) ? 1 : ratingNum,
                    width: widthVal,
                    length: lengthVal,
                    height: heightVal,
                    diameter: diameterVal,
                    weightKg: weightVal,
                    country: countryVal,
                    material: materialVal,
                }, {transaction});

                await syncMarketplaceParams(newProduct.id, marketplaceParams, transaction);

                for (const imageResult of additionalImageResults) {
                    await ProductImage.create({
                        url: imageResult.secure_url,
                        productId: newProduct.id,
                    }, {transaction});
                }

                return newProduct.id;
            });
            transactionCommitted = true;

            const newProduct = await Product.findByPk(createdProductId, {include: PRODUCT_INCLUDES});

            invalidateFeedCache();
            return res.json(newProduct);
        } catch (e) {
            console.error('PRODUCT CREATE ERROR:', e);

            if (!transactionCommitted) {
                await cleanupUploadedAssets();
            }

            next(e.status ? e : ApiError.internal('Помилка при створенні товару'));
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
                shape,
                purpose,
                features,
                width,
                length,
                height,
                diameter,
                weightKg,
                country,
                material,
                marketplaceParams,
            } = req.body;

            const {availability, rozetkaCategoryId, rating} = req.body;
            const availabilityNorm = normalizeAvailability(availability, undefined);

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

            if (req.files?.img) {
                const {img} = req.files;
                const result = await cloudinary.uploader.upload(img.tempFilePath || img.path, {
                    folder: 'products',
                });
                product.img = result.secure_url;
            }

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
                if (!Number.isNaN(typeIdNum)) {
                    product.typeId = typeIdNum;
                }
            }

            if (description !== undefined) product.description = description;
            if (rozetkaCategoryId !== undefined) product.rozetkaCategoryId = rzIdNum;

            if (color !== undefined) {
                product.color = String(color).trim() === '' ? null : String(color).trim();
            }

            if (kind !== undefined) {
                product.kind = String(kind).trim() === '' ? null : String(kind).trim();
            }

            if (shape !== undefined) {
                product.shape = String(shape).trim() === '' ? null : String(shape).trim();
            }

            if (purpose !== undefined) {
                product.purpose = String(purpose).trim() === '' ? null : String(purpose).trim();
            }

            if (features !== undefined) {
                product.features = String(features).trim() === '' ? null : String(features).trim();
            }

            if (rating !== undefined) {
                const ratingNum = Math.min(10, Math.max(1, Number(rating ?? 1)));
                if (!Number.isNaN(ratingNum)) product.rating = ratingNum;
            }

            if (width !== undefined) {
                product.width = String(width).trim() === '' ? null : String(width).trim();
            }

            if (length !== undefined) {
                product.length = String(length).trim() === '' ? null : String(length).trim();
            }

            if (height !== undefined) {
                product.height = String(height).trim() === '' ? null : String(height).trim();
            }

            if (diameter !== undefined) {
                product.diameter = String(diameter).trim() === '' ? null : String(diameter).trim();
            }

            if (material !== undefined) {
                product.material = String(material).trim() === '' ? null : String(material).trim();
            }

            if (country !== undefined) {
                const c = String(country).trim();
                product.country = c === '' ? 'Україна' : c;
            }

            if (weightKg !== undefined) {
                const wRaw = String(weightKg).trim();
                if (wRaw === '') {
                    product.weightKg = null;
                } else {
                    const wNum = Number(wRaw.replace(',', '.'));
                    product.weightKg = Number.isNaN(wNum) ? null : wNum;
                }
            }

            await product.save();
            await syncMarketplaceParams(product.id, marketplaceParams);
            await product.reload({include: PRODUCT_INCLUDES});

            invalidateFeedCache();
            return res.json(product);
        } catch (e) {
            next(e.status ? e : ApiError.internal(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {typeId, limit, page, sortBy} = req.query;
            page = Number(page) || 1;
            limit = Number(limit) || 9;
            const offset = page * limit - limit;

            let order = [['rating', 'DESC'], ['code', 'ASC']];

            if (sortBy === 'code') {
                order = [['code', 'ASC']];
            }

            const include = [
                {association: 'images'},
                {association: 'marketplaceParams'},
            ];

            let products;

            if (typeId) {
                products = await Product.findAndCountAll({
                    where: {typeId},
                    include,
                    limit,
                    offset,
                    distinct: true,
                    order,
                });
            } else {
                products = await Product.findAndCountAll({
                    include,
                    limit,
                    offset,
                    distinct: true,
                    order,
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
                include: PRODUCT_INCLUDES,
            });
            if (!product) return next(ApiError.notFound('Товар не знайдено'));
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

            for (const image of product.images) {
                const publicId = extractPublicId(image.url);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                }
            }

            const mainPublicId = extractPublicId(product.img);
            if (mainPublicId) {
                await cloudinary.uploader.destroy(mainPublicId);
            }

            await ProductMarketplaceParam.destroy({where: {productId: id}});
            await ProductImage.destroy({where: {productId: id}});
            await Product.destroy({where: {id}});

            invalidateFeedCache();
            return res.json({message: `Товар id=${id} та всі зображення видалені`});
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
            const filesArray = Array.isArray(files) ? files : [files];

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

            const publicId = extractPublicId(image.url);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }

            await ProductImage.destroy({where: {id}});
            invalidateFeedCache();

            return res.json({message: 'Зображення видалено'});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new ProductController();
