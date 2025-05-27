const {Type} = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res) {
        const {name} = req.body;
        const type = await Type.create({name});
        return res.json(type);
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
