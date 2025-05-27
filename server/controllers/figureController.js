const uuid = require('uuid');
const path = require('path');
const {Figure, FigureInfo} = require('../models/models');
const ApiError = require('../error/ApiError');

class FigureController {
    async create(req, res, next) {
        try {
            if (!req.files || !req.files.img) {
                return res.status(400).json({ message: 'Файл не завантажений' });
            }
            let {name, price, typeId, info} = req.body;
            const {img} = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const figure = await Figure.create({name, price, typeId, img: fileName});

            if (info) {
                info = JSON.parse(info);
                info.forEach(i => FigureInfo.create({
                    title: i.title,
                    description: i.description,
                    figureId: figure.id
                }));
            }

            return res.json(figure);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }

    async getAll(req, res, next) {
        try {
            let {typeId, limit, page} = req.query;
            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit;
            let figures;

            if (typeId) {
                figures = await Figure.findAndCountAll({where: {typeId}, limit, offset});
            } else {
                figures = await Figure.findAndCountAll({limit, offset});
            }

            return res.json(figures);
        } catch (e) {
            next(ApiError.internal('Помилка при отриманні фігур'));
        }
    }

    async getOne(req, res) {
        const {id} = req.params;
        const figure = await Figure.findOne(
            {
                where: {id},
                include: [{model: FigureInfo, as: 'info'}]
            },
        )
        return res.json(figure);
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const figure = await Figure.findByPk(id); // Знаходимо в БД об'єкт фігурки
            if (!figure) {
                return next(ApiError.badRequest(`Фігурка з id=${id} не знайдена`));
            }
            await Figure.destroy({where: {id}});
            return res.json({message: `Фігурка id=${id} успішно видалена`});
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new FigureController();
