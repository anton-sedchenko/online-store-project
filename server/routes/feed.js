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
    if (av === 'OUT_OF_STOCK') {
        return { available: 'false', stock: 0, madeToOrder: false };
    }

    if (av === 'MADE_TO_ORDER') {
        return { available: 'true', stock: 9999, madeToOrder: true };
    }

    return { available: 'true', stock: 9999, madeToOrder: false };
}

const safe = (v) => (v == null ? '' : String(v));
const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const isAbsUrl = (u) => /^https?:\/\//i.test(u);
const toAbsUrl = (base, u) => (isAbsUrl(u) ? u : `${base}${u.startsWith('/') ? '' : '/'}${u}`);

function addParamIf(offer, name, val) {
    if (val != null && String(val).trim() !== '') {
        offer.ele('param', { name }).txt(String(val)).up();
    }
}

function parseNum(val) {
    if (val == null) return null;
    const cleaned = String(val).trim().replace(',', '.');
    if (!cleaned) return null;
    const num = Number(cleaned);
    return Number.isNaN(num) ? null : num;
}

function splitFeatures(features) {
    if (!features) return [];
    return String(features)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

function normalizeRozetkaMaterial(material) {
    const value = safe(material).trim().toLowerCase();

    if (!value) return '';
    if (
        value.includes('бавов') ||
        value.includes('шнур')
    ) {
        return 'Бавовна';
    }

    return safe(material).trim();
}

function normalizeRozetkaColor(color) {
    const value = safe(color).trim().toLowerCase();

    if (!value) return '';
    if (value.includes('комб')) return 'Комбінований';
    if (value.includes('айвор')) return 'Айворі';
    if (value.includes('світло') && value.includes('сір')) return 'Світло-сірий';
    if (value === 'сірий' || value.includes(' сір')) return 'Сірий';
    if (value.includes('зел')) return 'Зелений';
    if (value.includes('черв')) return 'Червоний';
    if (value.includes('білий')) return 'Білий';
    if (value.includes('чор')) return 'Чорний';
    if (value.includes('шокол') || value.includes('глин') || value.includes('корич')) return 'Коричневий';

    return safe(color).trim();
}

function normalizeRozetkaPurpose(purpose) {
    const value = safe(purpose).trim().toLowerCase();

    if (!value) return '';
    if (value.includes('ванн')) return 'Універсальні';
    if (value.includes('кухн')) return 'Універсальні';
    if (value.includes('зберіган')) return 'Універсальні';
    if (value.includes('універс')) return 'Універсальні';
    if (value.includes('декоратив')) return 'Декоративні';

    return '';
}

function normalizeRozetkaShape(shape, product) {
    const value = safe(shape).trim().toLowerCase();

    if (value.includes('круг')) return 'Кругла';
    if (value.includes('овал')) return 'Овальна';
    if (value.includes('прямокут')) return 'Прямокутна';

    const diameter = parseNum(product.diameter);
    const width = parseNum(product.width);
    const length = parseNum(product.length);

    if (diameter && !width && !length) return 'Кругла';
    return '';
}

function normalizeRozetkaType(product) {
    const kind = safe(product.kind).trim().toLowerCase();
    const features = splitFeatures(product.features).map(v => v.toLowerCase());

    if (kind === 'набір' || features.includes('набір')) {
        return 'Набір';
    }

    return 'Один предмет';
}

function getRozetka4652688Features(product) {
    const features = splitFeatures(product.features);
    const normalized = [];

    for (const feature of features) {
        const value = feature.toLowerCase();

        if (value.includes('криш')) normalized.push('З кришкою');
        else if (value.includes('ручк')) normalized.push('З ручками');
        else if (value.includes('плет')) normalized.push('Плетені');
        else if (value.includes('набір')) normalized.push('Набір');
    }

    return [...new Set(normalized)];
}

function appendRozetka4652688Params(offer, product) {
    const country = safe(product.country).trim() || 'Україна';
    const material = normalizeRozetkaMaterial(product.material);
    const color = normalizeRozetkaColor(product.color);
    const purpose = normalizeRozetkaPurpose(product.purpose);
    const shape = normalizeRozetkaShape(product.shape, product);
    const type = normalizeRozetkaType(product);
    const features = getRozetka4652688Features(product);

    const width = parseNum(product.width);
    const length = parseNum(product.length);
    const height = parseNum(product.height);
    const diameter = parseNum(product.diameter);

    let finalWidth = width;
    let finalLength = length;

    if ((!finalWidth || !finalLength) && diameter) {
        finalWidth = diameter;
        finalLength = diameter;
    }

    addParamIf(offer, 'Тип', type);
    addParamIf(offer, 'Країна-виробник товару', country);
    addParamIf(offer, 'Матеріал', material);
    addParamIf(offer, 'Колір', color);
    addParamIf(offer, 'Призначення', purpose);
    addParamIf(offer, 'Форма', shape);
    addParamIf(offer, 'Висота', height);
    addParamIf(offer, 'Ширина', finalWidth);
    addParamIf(offer, 'Довжина', finalLength);

    for (const feature of features) {
        addParamIf(offer, 'Особливості', feature);
    }
}

function appendDefaultParams(offer, product) {
    addParamIf(offer, 'Ширина', product.width);
    addParamIf(offer, 'Довжина', product.length);
    addParamIf(offer, 'Висота', product.height);
    addParamIf(offer, 'Діаметр', product.diameter);

    if (product.weightKg != null) {
        addParamIf(offer, 'Вага', `${product.weightKg} кг`);
    }

    addParamIf(offer, 'Країна-виробник товару', product.country || 'Україна');
    addParamIf(offer, 'Колір', product.color);
    addParamIf(offer, 'Матеріал', product.material);
    addParamIf(offer, 'Тип виробу', product.kind);
    addParamIf(offer, 'Форма', product.shape);
    addParamIf(offer, 'Призначення', product.purpose);

    const features = splitFeatures(product.features);
    for (const feature of features) {
        addParamIf(offer, 'Особливості', feature);
    }
}

// ===== route =====
router.get('/rozetka.xml', async (req, res, next) => {
    try {
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

            const price = Number(p.price || 0);
            offer.ele('price').txt(price.toFixed(2)).up();
            offer.ele('currencyId').txt('UAH').up();
            offer.ele('categoryId').txt(String(categoryId)).up();

            const pics = [];
            if (safe(p.img)) pics.push(toAbsUrl(baseUrl, safe(p.img)));
            for (const im of (p.images || [])) {
                if (safe(im.url)) pics.push(toAbsUrl(baseUrl, safe(im.url)));
            }
            [...new Set(pics)].forEach(url => offer.ele('picture').txt(url).up());

            offer.ele('vendor').txt('Charivna Craft').up();
            if (p.code) offer.ele('vendorCode').txt(p.code).up();
            offer.ele('stock_quantity').txt(stock).up();

            offer.ele('name').txt(safe(p.name)).up();

            if (p.description) {
                const html = `<p>${truncate(String(p.description), 4800)}</p>`;
                offer.ele('description').dat(html).up();
            }

            if (madeToOrder) {
                offer.ele('param', { name: 'Готовність' }).txt('Виготовлення ~1 доба').up();
            }

            if (categoryId === '4652688') {
                appendRozetka4652688Params(offer, p);
            } else {
                appendDefaultParams(offer, p);
            }

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

router.invalidateFeedCache = invalidateFeedCache;
module.exports = router;