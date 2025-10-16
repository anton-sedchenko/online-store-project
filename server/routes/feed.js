const { Router } = require('express');
const { create } = require('xmlbuilder2');
const { Product, ProductImage, Type } = require('../models/models');
const { Op } = require('sequelize');

const router = Router();

// 10 хв у проді, вимкнено в інших середовищах
const CACHE_TTL_MS = process.env.NODE_ENV === 'production' ? 10 * 60 * 1000 : 0;

let cachedXml = null;
let cachedAt = 0;
const now = () => Date.now();

function invalidateFeedCache() {
    cachedXml = null;
    cachedAt = 0;
}

function mapAvailability(av) {
    if (av === 'IN_STOCK')      return { available: 'true', stock: '1', madeToOrder: false };
    if (av === 'MADE_TO_ORDER') return { available: 'true', stock: '1', madeToOrder: true  };
    return { available: 'false', stock: '0', madeToOrder: false };
}

const safe = (v) => (v == null ? '' : String(v));
const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const isAbsUrl = (u) => /^https?:\/\//i.test(u);
const toAbsUrl = (base, u) => (isAbsUrl(u) ? u : `${base}${u.startsWith('/') ? '' : '/'}${u}`);

// додає <param name="...">...</param>, якщо є значення
function addParamIf(offer, name, val) {
    if (val != null && String(val).trim() !== '') {
        offer.ele('param', { name }).txt(String(val)).up();
    }
}

// ===== route =====
router.get('/rozetka.xml', async (req, res, next) => {
    try {
        // кеш
        if (CACHE_TTL_MS > 0 && !('nocache' in req.query) && cachedXml && (now() - cachedAt) < CACHE_TTL_MS) {
            res.set('Content-Type', 'application/xml; charset=utf-8');
            res.set('Cache-Control', 'public, max-age=600');
            return res.send(cachedXml);
        }

        const baseUrl = process.env.BASE_URL || process.env.CLIENT_URL || 'https://charivna-craft.com.ua';

        const products = await Product.findAll({
            where: { rozetkaCategoryId: { [Op.ne]: null } },
            include: [
                { model: ProductImage, as: 'images' },
                { model: Type },
            ],
            order: [['id', 'ASC']],
        });

        const doc = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('yml_catalog', { date: new Date().toISOString().slice(0, 16).replace('T', ' ') })
            .ele('shop');

        doc.ele('name').txt('Charivna Craft').up()
            .ele('company').txt('Charivna Craft').up()
            .ele('url').txt(baseUrl).up();

        const currencies = doc.ele('currencies');
        currencies.ele('currency', { id: 'UAH', rate: '1' }).up();
        currencies.up();

        const categories = doc.ele('categories');
        const seenRozetka = new Set();

        for (const p of products) {
            const rzId = p.rozetkaCategoryId;
            if (rzId != null && !seenRozetka.has(rzId)) {
                categories.ele('category', { id: String(rzId) }).txt(String(rzId)).up();
                seenRozetka.add(rzId);
            }
        }
        categories.up();

        const offers = doc.ele('offers');

        for (const p of products) {
            const { available, stock, madeToOrder } = mapAvailability(p.availability);
            const categoryId = String(p.rozetkaCategoryId);

            const offer = offers.ele('offer', { id: String(p.id), available });

            // ціна / валюта / категорія
            const price = Number(p.price || 0);
            offer.ele('price').txt(price.toFixed(2)).up();
            offer.ele('currencyId').txt('UAH').up();
            offer.ele('categoryId').txt(String(categoryId)).up();

            // картинки: головне + додаткові, абсолютні, без дублікатів
            const pics = [];
            if (safe(p.img)) pics.push(toAbsUrl(baseUrl, safe(p.img)));
            for (const im of (p.images || [])) {
                if (safe(im.url)) pics.push(toAbsUrl(baseUrl, safe(im.url)));
            }
            [...new Set(pics)].forEach(url => offer.ele('picture').txt(url).up());

            // бренд / артикул / склад
            offer.ele('vendor').txt('Charivna Craft').up();
            if (p.code) offer.ele('vendorCode').txt(p.code).up();
            offer.ele('stock_quantity').txt(stock).up();

            // назва та опис
            offer.ele('name').txt(safe(p.name)).up();
            if (p.description) {
                const html = `<p>${truncate(String(p.description), 4800)}</p>`;
                offer.ele('description').dat(html).up();
            }

            // параметри
            if (madeToOrder) {
                offer.ele('param', { name: 'Готовність' }).txt('Виготовлення ~1 доба').up();
            }

            // розміри / вага / країна / колір / матеріал (опціонально)
            addParamIf(offer, 'Ширина',  p.width);
            addParamIf(offer, 'Довжина', p.length);
            addParamIf(offer, 'Висота',  p.height);
            addParamIf(offer, 'Діаметр', p.diameter);

            if (p.weightKg != null) addParamIf(offer, 'Вага', `${p.weightKg} кг`);
            addParamIf(offer, 'Країна-виробник товару', p.country || 'Україна');
            addParamIf(offer, 'Колір',    p.color);
            addParamIf(offer, 'Матеріал', p.material);

            offer.up();
        }

        offers.up();

        const xml = doc.end({ prettyPrint: true });

        if (CACHE_TTL_MS > 0) {
            cachedXml = xml;
            cachedAt = now();
        }

        res.set('Content-Type', 'application/xml; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=600');
        return res.send(xml);
    } catch (err) {
        return next(err);
    }
});

// додаємо метод інвалідації як властивість роутера
router.invalidateFeedCache = invalidateFeedCache;
module.exports = router;