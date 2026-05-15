const { Router } = require('express');
const { create } = require('xmlbuilder2');
const { Product, ProductImage, Type } = require('../models/models');
const { Op } = require('sequelize');

const router = Router();

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

function normalizeMaterial(material) {
    const value = safe(material).trim().toLowerCase();

    if (!value) return '';
    if (value.includes('бавов') || value.includes('шнур')) return 'Бавовна';

    return safe(material).trim();
}

function normalizeColor(color) {
    const value = safe(color).trim().toLowerCase();

    if (!value) return '';
    if (value.includes('черв') && value.includes('бі')) return 'Червоно-білий';
    if (value.includes('сіро') && value.includes('чор')) return 'Сіро-чорний';
    if (value.includes('комб')) return 'Комбінований';
    if (value.includes('айвор')) return 'Айворі';
    if (value.includes('світло') && value.includes('сір')) return 'Світло-сірий';
    if (value === 'сірий' || value.includes(' сір')) return 'Сірий';
    if (value.includes('зел')) return 'Зелений';
    if (value.includes('черв')) return 'Червоний';
    if (value.includes('білий')) return 'Білий';
    if (value.includes('чор')) return 'Чорний';
    if (value.includes('шокол') || value.includes('глин') || value.includes('корич') || value.includes('карам')) return 'Коричневий';

    return safe(color).trim();
}

function inferShape(product) {
    const value = safe(product.shape).trim().toLowerCase();
    if (value.includes('круг')) return 'Кругла';
    if (value.includes('овал')) return 'Овальна';
    if (value.includes('прямокут')) return 'Прямокутна';
    if (value.includes('квадрат')) return 'Квадратна';

    const diameter = parseNum(product.diameter);
    const width = parseNum(product.width);
    const length = parseNum(product.length);

    if (diameter && !width && !length) return 'Кругла';
    if (width && length) return 'Прямокутна';

    return '';
}

function isSetProduct(product) {
    const kind = safe(product.kind).trim().toLowerCase();
    const features = splitFeatures(product.features).map(v => v.toLowerCase());
    const name = safe(product.name).trim().toLowerCase();

    return (
        kind === 'набір' ||
        features.includes('набір') ||
        name.includes('набір') ||
        name.includes('set ') ||
        name.startsWith('set ')
    );
}

function normalizeStoragePurpose(product) {
    const value = safe(product.purpose).trim().toLowerCase();

    if (!value) return '';
    if (value.includes('декоратив')) return 'Декоративні';
    if (value.includes('ванн')) return 'Універсальні';
    if (value.includes('кухн')) return 'Універсальні';
    if (value.includes('зберіган')) return 'Універсальні';
    if (value.includes('універс')) return 'Універсальні';
    if (value.includes('білиз')) return 'Для одягу';

    return '';
}

function normalizeFeaturesForStorage(product) {
    const values = splitFeatures(product.features);
    const normalized = [];

    for (const feature of values) {
        const value = feature.toLowerCase();

        if (value.includes('криш')) normalized.push('З кришкою');
        else if (value.includes('ручк')) normalized.push('З ручками');
        else if (value.includes('плет')) normalized.push('Плетені');
        else if (value.includes('набір')) normalized.push('Набір');
    }

    return [...new Set(normalized)];
}

function getDimensionsForStorage(product) {
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

    return {
        width: finalWidth,
        length: finalLength,
        height,
    };
}

function appendStorageParams(offer, product) {
    const country = safe(product.country).trim() || 'Україна';
    const material = normalizeMaterial(product.material);
    const color = normalizeColor(product.color);
    const purpose = normalizeStoragePurpose(product);
    const shape = inferShape(product);
    const type = isSetProduct(product) ? 'Набір' : 'Один предмет';
    const features = normalizeFeaturesForStorage(product);
    const dims = getDimensionsForStorage(product);

    addParamIf(offer, 'Тип', type);
    addParamIf(offer, 'Країна-виробник товару', country);
    addParamIf(offer, 'Матеріал', material);
    addParamIf(offer, 'Колір', color);
    addParamIf(offer, 'Призначення', purpose);
    addParamIf(offer, 'Форма', shape);
    addParamIf(offer, 'Висота', dims.height);
    addParamIf(offer, 'Ширина', dims.width);
    addParamIf(offer, 'Довжина', dims.length);

    for (const feature of features) {
        addParamIf(offer, 'Особливості', feature);
    }
}

function buildSizeText(product) {
    const width = parseNum(product.width);
    const length = parseNum(product.length);
    const height = parseNum(product.height);
    const diameter = parseNum(product.diameter);

    if (width && length && height) return `${length}×${width}×${height} см`;
    if (width && length) return `${length}×${width} см`;
    if (diameter && height) return `${diameter}×${height} см`;
    if (diameter) return `${diameter} см`;
    return '';
}

function appendKitchenBasketParams(offer, product) {
    const country = safe(product.country).trim() || 'Україна';
    const material = normalizeMaterial(product.material);
    const color = normalizeColor(product.color);
    const shape = inferShape(product);
    const size = buildSizeText(product);
    const features = normalizeFeaturesForStorage(product);

    addParamIf(offer, 'Тип поставки', isSetProduct(product) ? 'Набір' : 'Один предмет');
    addParamIf(offer, 'Країна-виробник товару', country);
    addParamIf(offer, 'Матеріал', material);
    addParamIf(offer, 'Колір', color);
    addParamIf(offer, 'Форма', shape);
    addParamIf(offer, 'Розміри', size);

    if (isSetProduct(product)) {
        addParamIf(offer, 'Кількість у наборі', 2);
    }

    for (const feature of features) {
        addParamIf(offer, 'Особливості', feature);
    }
}

function normalizePlacematType(product) {
    const kind = safe(product.kind).trim().toLowerCase();
    const name = safe(product.name).trim().toLowerCase();

    if (isSetProduct(product)) return 'Набір';
    if (kind.includes('костер') || name.includes('під напої')) return 'Підставка';
    return 'Плейсмат';
}

function normalizePlacematUsage(product) {
    const value = safe(product.purpose).trim().toLowerCase();

    if (!value) return 'Для сервірування';
    if (value.includes('декоратив')) return 'Для декору';
    return 'Для сервірування';
}

function appendPlacematParams(offer, product) {
    const country = safe(product.country).trim() || 'Україна';
    const material = normalizeMaterial(product.material);
    const color = normalizeColor(product.color);
    const shape = inferShape(product);
    const features = normalizeFeaturesForStorage(product);
    const size = buildSizeText(product);

    addParamIf(offer, 'Тип', normalizePlacematType(product));
    addParamIf(offer, 'Країна-виробник товару', country);
    addParamIf(offer, 'Матеріал', material);
    addParamIf(offer, 'Колір', color);
    addParamIf(offer, 'Форма', shape);
    addParamIf(offer, 'Розміри', size);
    addParamIf(offer, 'Використання', normalizePlacematUsage(product));

    for (const feature of features) {
        addParamIf(offer, 'Особливості', feature);
    }
}

function normalizeCoasterType(product) {
    const kind = safe(product.kind).trim().toLowerCase();
    const name = safe(product.name).trim().toLowerCase();

    if (isSetProduct(product)) return 'Набір підставок';
    if (kind.includes('костер') || name.includes('під напої')) return 'Підставка під посуд';
    return 'Підставка під посуд';
}

function appendCoasterParams(offer, product) {
    const country = safe(product.country).trim() || 'Україна';
    const material = normalizeMaterial(product.material);
    const color = normalizeColor(product.color);
    const shape = inferShape(product);
    const size = buildSizeText(product);

    addParamIf(offer, 'Тип', normalizeCoasterType(product));
    addParamIf(offer, 'Країна-виробник товару', country);
    addParamIf(offer, 'Матеріал', material);
    addParamIf(offer, 'Колір', color);
    addParamIf(offer, 'Форма', shape);
    addParamIf(offer, 'Розміри', size);

    if (isSetProduct(product)) {
        addParamIf(offer, 'Кількість предметів', 2);
    }
}

function normalizePlanterPurpose(product) {
    const value = safe(product.purpose).trim().toLowerCase();
    if (!value) return 'Для рослин';
    if (value.includes('декоратив')) return 'Декоративне';
    return 'Для рослин';
}

function normalizePlanterPlacement() {
    return 'Настільне';
}

function appendPlanterParams(offer, product) {
    const country = safe(product.country).trim() || 'Україна';
    const material = normalizeMaterial(product.material);
    const color = normalizeColor(product.color);
    const shape = inferShape(product);
    const size = buildSizeText(product);
    const features = normalizeFeaturesForStorage(product);

    addParamIf(offer, 'Тип', 'Кашпо');
    addParamIf(offer, 'Країна-виробник', country);
    addParamIf(offer, 'Матеріал', material);
    addParamIf(offer, 'Колір', color);
    addParamIf(offer, 'Форма', shape);
    addParamIf(offer, 'Розмір', size);
    addParamIf(offer, 'Зовнішні розміри', size);
    addParamIf(offer, 'Призначення', normalizePlanterPurpose(product));
    addParamIf(offer, 'Розміщення', normalizePlanterPlacement());

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

function appendParamsByCategory(offer, product, categoryId) {
    const storageIds = new Set(['4652688', '389782779', '213']);
    const kitchenBasketIds = new Set(['4626843', '4652687']);
    const placematIds = new Set(['169828']);
    const coasterIds = new Set(['4674759']);
    const planterIds = new Set(['245547']);

    if (storageIds.has(categoryId)) {
        appendStorageParams(offer, product);
        return;
    }

    if (kitchenBasketIds.has(categoryId)) {
        appendKitchenBasketParams(offer, product);
        return;
    }

    if (placematIds.has(categoryId)) {
        appendPlacematParams(offer, product);
        return;
    }

    if (coasterIds.has(categoryId)) {
        appendCoasterParams(offer, product);
        return;
    }

    if (planterIds.has(categoryId)) {
        appendPlanterParams(offer, product);
        return;
    }

    appendDefaultParams(offer, product);
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
            offer.ele('categoryId').txt(categoryId).up();

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

            appendParamsByCategory(offer, p, categoryId);
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