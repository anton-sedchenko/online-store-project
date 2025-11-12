const { Router } = require('express');
const { create } = require('xmlbuilder2');
const { Product, Type, ProductImage } = require('../models/models');
let slugify; try { slugify = require('slugify'); } catch { slugify = s => String(s || ''); }

const router = Router();

// --- Константи ---
const SITE = 'https://charivna-craft.com.ua';
const CURRENCY = 'UAH';

// Дозволені типи (все інше відсікаємо)
const ALLOW_TYPES = new Set([
    'Гіпсові фігурки',
    'Вироби зі шнура: серветки підтарільники, кошики, підставки під гаряче...',
    'Вироби з бісеру: гердани, браслети, чокери...',
]);

// Google Product Categories (офіційні рядки)
const GPC = {
    FIGURINES: 'Home & Garden > Decor > Figurines',
    JEWELRY: 'Apparel & Accessories > Jewelry',
    BASKETS: 'Home & Garden > Storage & Organization > Baskets',
    PLACEMATS: 'Home & Garden > Kitchen & Dining > Table Linens > Placemats',
    TRIVETS: 'Home & Garden > Kitchen & Dining > Kitchen Tools & Utensils > Trivets',
};

// ключові слова для автодетекту дозволених груп
const KW = {
    // групи
    FIGURINE: /(фігурк|статует|figurine|статуэт)/i,
    JEWELRY: /(гердан|браслет|чокер|намист|ожерел|necklace|bracelet|choker)/i,
    CORD_ANY: /(кошик|кошики|корзин|basket|підтарі?льник|серветк|placemat|подтарелочник|підставк[^ ]*\s*під\s*гаряч|trivet|подставк[^ ]*\s*под\s*горяч)/i,
    // підтипи "зі шнура"
    BASKET: /(кошик|кошики|корзин|basket)/i,
    PLACEMAT: /(підтарі?льник|серветк|placemat|подтарелочник)/i,
    TRIVET: /(підставк[^ ]*\s*під\s*гаряч|trivet|подставк[^ ]*\s*под\s*горяч)/i,
};

const norm = (s) => String(s || '').trim();
function sanitizeText(v, max = 5000) {
    const s = String(v == null ? '' : v);
    return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max);
}
function absUrl(u) {
    if (!u) return '';
    const s = String(u);
    return /^https?:\/\//i.test(s) ? s : `${SITE}/${s.replace(/^\/+/, '')}`;
}
function mapAvailability(av) {
    if (av === 'IN_STOCK') return 'in stock';
    if (av === 'MADE_TO_ORDER') return 'preorder';
    return 'out of stock';
}

// чи потрапляє товар у одну з трьох дозволених груп
function isAllowedProduct(p, typeName) {
    const t = norm(typeName);
    if (t && ALLOW_TYPES.has(t)) return true; // прямий збіг типу

    // якщо тип відсутній/тестовий — дозволимо по ключових словах
    const hay = `${p?.name || ''} ${p?.description || ''}`; // title+desc
    if (KW.FIGURINE.test(hay)) return true;
    if (KW.JEWELRY.test(hay)) return true;
    if (KW.CORD_ANY.test(hay)) return true;
    return false;
}

// визначаємо офіційну GPC для дозволених товарів
function resolveGoogleCategory(typeName, product) {
    const t = norm(typeName);
    const hay = `${product?.name || ''} ${product?.description || ''}`;

    // 1) чіткий тип
    if (t === 'Гіпсові фігурки') return GPC.FIGURINES;
    if (t === 'Вироби з бісеру: гердани, браслети, чокери...') return GPC.JEWELRY;
    if (t === 'Вироби зі шнура: серветки підтарільники, кошики, підставки під гаряче...') {
        if (KW.BASKET.test(hay)) return GPC.BASKETS;
        if (KW.PLACEMAT.test(hay)) return GPC.PLACEMATS;
        if (KW.TRIVET.test(hay)) return GPC.TRIVETS;
        return null; // шнур, але не зрозуміли підтип — ок
    }

    // 2) без типу — за ключовими словами
    if (KW.FIGURINE.test(hay)) return GPC.FIGURINES;
    if (KW.JEWELRY.test(hay)) return GPC.JEWELRY;
    if (KW.BASKET.test(hay)) return GPC.BASKETS;
    if (KW.PLACEMAT.test(hay)) return GPC.PLACEMATS;
    if (KW.TRIVET.test(hay)) return GPC.TRIVETS;

    return null;
}

router.get('/gmc.xml', async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Type, required: false },
                { model: ProductImage, as: 'images', required: false },
            ],
            order: [['id', 'ASC']],
        });

        const root = create({ version: '1.0', encoding: 'UTF-8' })
            .ele('rss', { version: '2.0', 'xmlns:g': 'http://base.google.com/ns/1.0' })
            .ele('channel');

        root.ele('title').txt('Charivna Craft — Каталог');
        root.ele('link').txt(SITE);
        root.ele('description').txt('Файловий фід для Google Merchant');

        for (const p of products) {
            try {
                const typeName = norm(p.Type && p.Type.name);

                // Відсікаємо все, що не належить до 3 дозволених груп
                if (!isAllowedProduct(p, typeName)) continue;

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

                // product_type — твоя ієрархія
                if (typeName) {
                    item.ele('g:product_type').txt(`Handmade > ${sanitizeText(typeName, 200)}`);
                } else {
                    // автопідбір назви групи, коли Type відсутній
                    const hay = `${p.name || ''} ${p.description || ''}`;
                    let pt = 'Handmade';
                    if (KW.JEWELRY.test(hay)) pt = 'Handmade > Прикраси';
                    else if (KW.FIGURINE.test(hay)) pt = 'Handmade > Фігурки';
                    else if (KW.CORD_ANY.test(hay)) pt = 'Handmade > Вироби зі шнура';
                    item.ele('g:product_type').txt(pt);
                }

                // google_product_category — офіційна таксономія
                const gpc = resolveGoogleCategory(typeName, p);
                if (gpc) item.ele('g:google_product_category').txt(gpc);

                // Ідентифікатори для handmade
                item.ele('g:brand').txt('Charivna Craft');
                item.ele('g:identifier_exists').txt('no');

            } catch (e) {
                console.error('[GMC FEED] skipped id=', p?.id, e?.message);
            }
        }

        const xml = root.end({ prettyPrint: true });
        res.set('Content-Type', 'application/rss+xml; charset=UTF-8');
        res.send(xml);
    } catch (err) {
        console.error('[GMC FEED] fatal:', err);
        next(err);
    }
});

module.exports = router;