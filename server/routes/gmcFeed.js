const { Router } = require('express');
const { create } = require('xmlbuilder2');
const { Product, Type, ProductImage } = require('../models/models');
let slugify;
try { slugify = require('slugify'); } catch (e) { slugify = (s)=>String(s||''); }

const router = Router();

const SITE = 'https://charivna-craft.com.ua';
const CURRENCY = 'UAH';
const LANG = 'uk';

function mapAvailability(av) {
    if (av === 'IN_STOCK') return 'in stock';
    if (av === 'MADE_TO_ORDER') return 'preorder';
    return 'out of stock';
}

// видаляємо заборонені для XML control chars (0x00–0x08,0x0B,0x0C,0x0E–0x1F)
function sanitizeText(v, max = 5000) {
    const s = String(v == null ? '' : v);
    const cleaned = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
    return cleaned.slice(0, max);
}
function absUrl(u) {
    if (!u) return '';
    const s = String(u);
    return /^https?:\/\//i.test(s) ? s : `${SITE}/${s.replace(/^\/+/, '')}`;
}

router.get('/gmc.xml', async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Type, required: false },
                { model: ProductImage, required: false },
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
                const name = sanitizeText(p.name, 150);
                const description = sanitizeText(p.description || p.name, 5000);
                const slug = sanitizeText(p.slug) || slugify(name, { lower: true, strict: true });
                const link = `${SITE}/product/${slug}`;

                const mainImg = absUrl(p.img);
                const additional = Array.isArray(p.ProductImages)
                    ? p.ProductImages.map(pi => absUrl(pi.url)).filter(Boolean).slice(0, 10)
                    : [];

                const item = root.ele('item');
                item.ele('g:id').txt(String(p.id));
                item.ele('title').txt(name);
                item.ele('description').dat(description);
                item.ele('link').txt(link);

                if (mainImg) item.ele('g:image_link').txt(mainImg);
                for (const u of additional) item.ele('g:additional_image_link').txt(u);

                item.ele('g:availability').txt(mapAvailability(p.availability));
                const priceNum = Number(p.price ?? 0);
                item.ele('g:price').txt(`${isFinite(priceNum) ? priceNum.toFixed(2) : '0.00'} ${CURRENCY}`);
                item.ele('g:condition').txt('new');

                item.ele('g:brand').txt('Charivna Craft');
                item.ele('g:identifier_exists').txt('false');

                if (p.Type && p.Type.name) item.ele('g:product_type').txt(`Handmade > ${sanitizeText(p.Type.name, 200)}`);

                item.ele('g:content_language').txt(LANG);
                item.ele('g:target_country').txt('UA');
            } catch (e) {
                skipped++;
                console.error('[GMC FEED] skipped product id=', p?.id, 'reason=', e?.message);
            }
        }

        const xml = root.end({ prettyPrint: true });
        res.set('Content-Type', 'application/rss+xml; charset=UTF-8');
        // можна підглядати у відповідь, скільки скіпнули (коментарем)
        res.send(xml /* + `\n<!-- skipped: ${skipped} -->` */);
    } catch (err) {
        console.error('[GMC FEED] fatal:', err);
        next(err);
    }
});

module.exports = router;