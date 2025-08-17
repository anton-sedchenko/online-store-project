const { Review, Product, User } = require('../models/models');
const ApiError = require('../error/ApiError');

const mailer = require('../mailer');

function avg(arr) {
    if (!arr.length) return 0;
    return Math.round( (arr.reduce((s,n)=>s+n,0) / arr.length) * 10 ) / 10;
}

class ReviewController {
    // GET /api/review/:productId
    async listByProduct(req,res,next){
        try{
            const { productId } = req.params;
            const roots = await Review.findAll({
                where: { productId, parentId: null, deletedAt: null },
                order: [['createdAt','DESC']],
                include: [{ model: User, attributes: ['id','email'] }]
            });

            const ids = roots.map(r=>r.id);
            const replies = ids.length ? await Review.findAll({
                where: { parentId: ids, deletedAt: null },
                order: [['createdAt','ASC']],
                include: [{ model: User, attributes: ['id','email'] }]
            }) : [];

            // групуємо відповіді до батьків
            const byParent = replies.reduce((m,r)=>{
                (m[r.parentId] ||= []).push(r);
                return m;
            },{});

            const ratingValues = roots.map(r => r.rating).filter(Boolean);
            const response = {
                items: roots.map(r => ({...r.toJSON(), replies: byParent[r.id] || []})),
                rating: {
                    avg: avg(ratingValues),
                    count: ratingValues.length
                }
            };
            return res.json(response);
        }catch(e){ next(ApiError.internal(e.message)); }
    }

    // POST /api/review
    async createRoot(req,res,next){
        try{
            const userId = req.user.id;
            const { productId, rating, text } = req.body;
            if (!productId || !text?.trim()) return next(ApiError.badRequest('Не передано productId або текст'));

            // перевіряємо, чи вже є верхньорівневий відгук від цього користувача з оцінкою (або без — унікальний індекс усе одно не дасть)
            if (rating) {
                const num = Number(rating);
                if (Number.isNaN(num) || num < 1 || num > 5) return next(ApiError.badRequest('Рейтинг 1–5'));
            }

            const created = await Review.create({
                productId,
                userId,
                parentId: null,
                rating: rating ? Number(rating) : null,
                text: text.trim()
            });

            // email адміну
            try {
                const link = `${process.env.CLIENT_URL}/product/${productId}`;
                await mailer.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: process.env.NOTIFY_EMAIL || 'charivna.craft@gmail.com',
                    subject: 'Новий відгук на сайті',
                    html: `<p>Користувач ${req.user.email} залишив відгук.</p><p><a href="${link}">Відкрити товар</a></p>`
                });
            } catch(e){ console.error('review email admin fail', e?.message); }

            return res.status(201).json(created);
        }catch(e){
            // якщо вперлися в unique (productId,userId,parentId)
            if (e?.name === 'SequelizeUniqueConstraintError') {
                return next(ApiError.badRequest('Ви вже залишали відгук до цього товару'));
            }
            next(ApiError.internal(e.message));
        }
    }

    // POST /api/review/:parentId/reply
    async reply(req,res,next){
        try{
            const userId = req.user.id;
            const { parentId } = req.params;
            const { text } = req.body;
            if (!text?.trim()) return next(ApiError.badRequest('Порожній текст'));

            const parent = await Review.findByPk(parentId, { include: [{ model: User, attributes: ['id','email'] }] });
            if (!parent || parent.deletedAt) return next(ApiError.notFound('Батьківський відгук не знайдено'));

            const created = await Review.create({
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

            return res.status(201).json(created);
        }catch(e){ next(ApiError.internal(e.message)); }
    }

    // DELETE /api/review/:id (ADMIN)
    async remove(req,res,next){
        try{
            const { id } = req.params;
            const item = await Review.findByPk(id);
            if (!item) return next(ApiError.notFound('Коментар не знайдено'));

            // “мʼяке” видалення — позначимо deletedAt, щоб зберегти гілку
            item.deletedAt = new Date();
            await item.save();
            return res.json({ ok:true });
        }catch(e){ next(ApiError.internal(e.message)); }
    }
}

module.exports = new ReviewController();