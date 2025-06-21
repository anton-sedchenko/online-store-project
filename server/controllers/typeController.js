const {Type} = require('../models/models');
const ApiError = require('../error/ApiError');

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
