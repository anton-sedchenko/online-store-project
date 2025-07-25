const {Type} = require('../models/models');
const ApiError = require('../error/ApiError');
const {cloudinary, extractPublicId} = require('../utils/cloudinary');

class TypeController {
    async create(req, res,next) {
        try {
            const {name} = req.body;
            if (!name || !name.trim()) {
                return next(ApiError.badRequest("Name is required"));
            }
            const type = await Type.create({name});
            return res.json(type);
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest("Type already exists"));
            }
            next(ApiError.internal(e.message));
        }
    }

    async getAll(req, res) {
        const types = await Type.findAll();
        return res.json(types);
    }

    // метод для отримання однієї категорії
    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const type = await Type.findByPk(id);
            if (!type) return next(ApiError.notFound(`Категорія ${id} не знайдена`));
            return res.json(type);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, parentId} = req.body;
            const type = await Type.findByPk(id);
            if (!type) return next(ApiError.notFound(`Категорія ${id} не знайдена`));
            if (name) type.name = name.trim();
            if (parentId !== undefined) type.parentId = parentId;
            await type.save();
            return res.json(type);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // метод для оновлення картинки
    async updateImage(req, res, next) {
        try {
            const {id} = req.params;
            const type = await Type.findByPk(id);
            if (!type) return next(ApiError.notFound(`Категорія ${id} не знайдена`));
            if (!req.files || !req.files.image) {
                return next(ApiError.badRequest('Файл не передано'));
            }
            // видалити стару картинку з Cloudinary, якщо була
            if (type.image) {
                const oldPublicId = extractPublicId(type.image);
                if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
            }
            // завантажити нову
            const {image} = req.files;
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: 'categories',
            });
            type.image = result.secure_url;
            await type.save();
            return res.json(type);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const type = await Type.findByPk(id);
            if (!type) {
                return next(ApiError.badRequest(`Тип з id=${id} не знайдено`));
            }
            await Type.destroy({where: {id}});
            return res.json({message: `Тип id=${id} успішно видалено`});
        } catch(e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new TypeController();
