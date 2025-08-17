const { Review, Product, User } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

const mailer = require('../mailer');

function avg(arr) {
    if (!arr.length) return 0;
    return Math.round( (arr.reduce((s,n)=>s+n,0) / arr.length) * 10 ) / 10;
}

class ReviewController {
    // GET /api/review/:productId
    async listByProduct(req, res, next) {
        try {
            const { productId } = req.params;
            if (!productId || isNaN(Number(productId))) {
                return res.status(400).json({ message: 'Invalid productId' });
            }

            // корені
            const roots = await Review.findAll({
                where: {productId, parentId: null},
                order: [['createdAt', 'DESC']],
                include: [{ model: User, attributes: ['id', 'name'] }]
            });

            // відповіді
            const ids = roots.map(r => r.id);
            const replies = ids.length
                ? await Review.findAll({
                    where: {parentId: ids},
                    order: [['createdAt', 'ASC']],
                    include: [{ model: User, attributes: ['id', 'name'] }]
                })
                : [];

            // плаский список: корені + відповіді
            const items = [...roots, ...replies]
                .map(r => r.toJSON())
                // (не обов’язково) загальне сортування за часом, новіші вище
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const ratingValues = roots.map(r => r.rating).filter(Boolean);

            return res.json({
                items,
                rating: {
                    avg: avg(ratingValues),
                    count: ratingValues.length,
                },
            });
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    // POST /api/review
    async createRoot(req, res, next) {
        try {
            const userId = req.user.id;
            const { productId, rating, text } = req.body;

            if (!productId) {
                return next(ApiError.badRequest('Не передано productId'));
            }

            // чи прийшла оцінка?
            const hasRating = rating !== undefined && rating !== null && rating !== '';
            let num = null;

            if (hasRating) {
                num = Number(rating);
                if (Number.isNaN(num) || num < 1 || num > 5) {
                    return next(ApiError.badRequest('Оцінка має бути від 1 до 5'));
                }

                // обмеження: одна оцінка на користувача для товару
                const alreadyRated = await Review.findOne({
                    where: {
                        productId,
                        userId,
                        parentId: null,
                        rating: { [Op.not]: null },
                    },
                });
                if (alreadyRated) {
                    return next(ApiError.badRequest('Ви вже оцінювали цей товар'));
                }
            }

            // якщо немає оцінки — це просто коментар; текст має бути
            if (!hasRating && !text?.trim()) {
                return next(ApiError.badRequest('Порожній коментар'));
            }

            const created = await Review.create({
                productId,
                userId,
                parentId: null,
                rating: hasRating ? num : null, // оцінка або null
                text: text?.trim() || null, // коментар може бути порожнім, якщо це чиста оцінка
            });

            return res.status(201).json(created);
        } catch (e) {
            if (e?.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Ви вже оцінювали цей товар'));
            }
            next(ApiError.internal(e.message));
        }
    }

    // POST /api/review/:parentId/reply
    async reply(req,res,next){
        try{
            if (req.user?.role !== 'ADMIN') {
                return next(ApiError.forbidden('Лише адміністратор може відповідати'));
            }
            const userId = req.user.id;
            const { parentId } = req.params;
            const { text } = req.body;
            if (!text?.trim()) return next(ApiError.badRequest('Порожній текст'));

            const parent = await Review.findByPk(
                parentId,
                {include: [{ model: User, attributes: ['id','email'] }]}
            );
            if (!parent || parent.deletedAt) return next(ApiError.notFound('Батьківський відгук не знайдено'));

            const review = await Review.create({
                productId: parent.productId,
                userId,
                parentId: parent.id,
                rating: null,
                text: text.trim()
            });

            // email адміну
            try {
                const link = `${process.env.CLIENT_URL}/product/${parent.productId}`;
                await mailer.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: process.env.NOTIFY_EMAIL || 'charivna.craft@gmail.com',
                    subject: 'Нова відповідь у відгуках',
                    html: `<p>Користувач ${req.user.email} відповів у гілці відгуків.</p><p><a href="${link}">Відкрити товар</a></p>`
                });
            } catch(e){ console.error('reply email admin fail', e?.message); }

            // email автору батьківського комента (якщо є e-mail)
            try {
                if (parent.user?.email) {
                    await mailer.sendMail({
                        from: process.env.EMAIL_FROM,
                        to: parent.user.email,
                        subject: 'Вам відповіли у відгуках',
                        html: `<p>Вам відповіли у відгуках до товару.</p>`
                    });
                }
            } catch(e){ console.error('reply email user fail', e?.message); }

            return res.status(201).json(review);
        }catch(e){ next(ApiError.internal(e.message)); }
    }

    // DELETE /api/review/:id (ADMIN) — ЖОРСТКЕ видалення з каскадом
    async remove(req, res, next) {
        try {
            const { id } = req.params;
            const root = await Review.findByPk(id);
            if (!root) return next(ApiError.notFound('Коментар не знайдено'));

            // Збираємо ВСІ нащадки рекурсивно (будь-яка глибина)
            const toDelete = [Number(id)];
            const allIds = [];

            while (toDelete.length) {
                const batch = toDelete.splice(0, toDelete.length);
                allIds.push(...batch);

                // шукаємо прямих дітей для кожного id з batch
                const children = await Review.findAll({
                    where: { parentId: batch },
                    attributes: ['id'],
                });
                if (children.length) {
                    toDelete.push(...children.map(c => c.id));
                }
            }

            // Жорстко видаляємо все
            await Review.destroy({ where: { id: allIds } });

            return res.json({ ok: true, deleted: allIds.length });
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new ReviewController();