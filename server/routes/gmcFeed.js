const { Router } = require('express');
const { create } = require('xmlbuilder2');
const { Product, Type, ProductImage } = require('../models/models');
let slugify; try { slugify = require('slugify'); } catch { slugify = s => String(s || ''); }

const router = Router();

// === Константи ===
const SITE = 'https://charivna-craft.com.ua';
const CURRENCY = 'UAH';
const LANG = 'uk';

// Вимкнені категорії (не віддаємо у фід)
const EXCLUDE_TYPES = new Set(['Фарби']);

// Базові GPC для головних груп
const GPC = {
    FIGURINES: 'Home & Garden > Decor > Figurines',
    JEWELRY: 'Apparel & Accessories > Jewelry',
    BASKETS: 'Home & Garden > Storage & Organization > Baskets',
    PLACEMATS: 'Home & Garden > Kitchen & Dining > Table Linens > Placemats',
    TRIVETS: 'Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils > Trivets',
};

// Підтипи для “Вироби зі шнура …” шукаємо в назві/описі
const KW = {
    BASKET: /\b(кошик|кошики|корзин\w*|basket)\b/i,
    PLACEMAT: /\b(підтарі[л|ль]ник\w*|підтарі[л|ль]ники|серветк\w*|placemat\w*)\b/i,
    TRIVET: /\b(підставк\w*\s*під\s*гаряч\w*|trivet\w*)\b/i,
};

// Тести/чернетки в назвах типів — не додаємо g:google_product_category
const isTestType = (name = '') => /(^|\s)(test|тест|чернетк)/i.test(String(name));

// === Хелпери ===
function mapAvailability(av) {
    if (av === 'IN_STOCK') return 'in stock';
    if (av === 'MADE_TO_ORDER') return 'preorder';
    return 'out of stock';
}
function sanitizeText(v, max = 5000) {
    const s = String(v == null ? '' : v);
    return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max);
}
function absUrl(u) {
    if (!u) return '';
    const s = String(u);
    return /^https?:\/\//i.test(s) ? s : `${SITE}/${s.replace(/^\/+/, '')}`;
}
function norm(s) { return String(s || '').trim(); }

// Визначаємо офіційну категорію Google з урахуванням типу та ключових слів
function resolveGoogleCategory(typeName, product) {
    const t = norm(typeName);

    // 1) Фільтрація вимкнених/тестових
    if (!t || EXCLUDE_TYPES.has(t) || isTestType(t)) return null;

    // 2) Прості відповідності типів
    if (t === 'Гіпсові фігурки') return GPC.FIGURINES;
    if (t === 'Вироби з бісеру: гердани, браслети, чокери...') return GPC.JEWELRY;

    // 3) Вироби зі шнура — уточнюємо за ключовими словами
    if (t === 'Вироби зі шнура: серветки підтарільники, кошики, підставки під гаряче...') {
        const hay = `${product?.name || ''} ${product?.description || ''}`;
        if (KW.BASKET.test(hay)) return GPC.BASKETS;
        if (KW.PLACEMAT.test(hay)) return GPC.PLACEMATS;
        if (KW.TRIVET.test(hay)) return GPC.TRIVETS;
        // якщо точно не визначили — краще нічого не ставити, Google сам класифікує
        return null;
    }

    // 4) Інші/невідомі — не задаємо, це не помилка
    return null;
}

router.get('/gmc.xml', async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Type, required: false },                    // без alias
                { model: ProductImage, as: 'images', required: false } // alias 'images'
            ],
            order: [['id', 'ASC']],
        });

        const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('rss', { version: '2.0', 'xmlns:g': 'http://base.google.com/ns/1.0' })
            .ele('channel');

        root.ele('title').txt('Charivna Craft — Каталог');
        root.ele('link').txt(SITE);
        root.ele('description').txt('Файловий фід для Google Merchant');

        let skipped = 0;

        for (const p of products) {
            try {
                const typeName = norm(p.Type && p.Type.name);

                // Вимикаємо “Фарби” та пусті типи
                if (!typeName || EXCLUDE_TYPES.has(typeName)) continue;

                const title = sanitizeText(p.name, 150);
                const description = sanitizeText(p.description || p.name, 5000);
                const slug = sanitizeText(p.slug) || slugify(title, { lower: true, strict: true });
                const link = `${SITE}/product/${slug}`;

                const mainImg = absUrl(p.img);
                const additional = Array.isArray(p.images)
                    ? p.images.map(pi => absUrl(pi.url)).filter(Boolean).slice(0, 10)
                    : [];

                const item = root.ele('item');
                item.ele('g:id').txt(String(p.id));
                item.ele('title').txt(title);
                item.ele('description').dat(description);
                item.ele('link').txt(link);

                if (mainImg) item.ele('g:image_link').txt(mainImg);
                for (const u of additional) item.ele('g:additional_image_link').txt(u);

                item.ele('g:availability').txt(mapAvailability(p.availability));

                const priceNum = Number(p.price ?? 0);
                item.ele('g:price').txt(`${isFinite(priceNum) ? priceNum.toFixed(2) : '0.00'} ${CURRENCY}`);
                item.ele('g:condition').txt('new');

                // product_type — наша власна ієрархія (допомагає в кампаніях)
                item.ele('g:product_type').txt(`Handmade > ${sanitizeText(typeName, 200)}`);

                // google_product_category — лише для відомих комбінацій
                const gpc = resolveGoogleCategory(typeName, p);
                if (gpc) item.ele('g:google_product_category').txt(gpc);

                // Ідентифікатори для handmade
                item.ele('g:brand').txt('Charivna Craft');
                item.ele('g:identifier_exists').txt('no');

                // За потреби: availability_date для preorder, якщо є очікувана дата
                // if (p.availability === 'MADE_TO_ORDER' && p.expectedAt) {
                //   item.ele('g:availability_date').txt(new Date(p.expectedAt).toISOString());
                // }

            } catch (e) {
                skipped++;
                console.error('[GMC FEED] skipped id=', p?.id, e?.message);
            }
        }

        const xml = root.end({ prettyPrint: true });
        res.set('Content-Type', 'application/rss+xml; charset=UTF-8');
        res.send(xml /* + `\n<!-- skipped: ${skipped} -->` */);
    } catch (err) {
        console.error('[GMC FEED] fatal:', err);
        next(err);
    }
});

module.exports = router;