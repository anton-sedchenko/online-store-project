const { Router } = require('express');
const { create } = require('xmlbuilder2');
const { Product, Type, ProductImage } = require('../models/models');
const slugify = require('slugify');

const router = Router();

const SITE = 'https://charivna-craft.com.ua';
const CURRENCY = 'UAH';
const LANG = 'uk';

function mapAvailability(av) {
    if (av === 'IN_STOCK') return 'in stock';
    if (av === 'MADE_TO_ORDER') return 'preorder';
    return 'out of stock';
}

function absUrl(u) {
    if (!u) return '';
    return /^https?:\/\//i.test(u) ? u : `${SITE}/${String(u).replace(/^\/+/, '')}`;
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

        for (const p of products) {
            const slug = p.slug || slugify(p.name || `id-${p.id}`, { lower: true, strict: true });
            const link = `${SITE}/product/${slug}`;

            const mainImg = absUrl(p.img);
            const additional = (p.ProductImages || []).map(pi => absUrl(pi.url)).filter(Boolean);

            const item = root.ele('item');
            item.ele('g:id').txt(String(p.id));
            item.ele('title').txt((p.name || '').slice(0, 150));
            item.ele('description').dat((p.description || p.name || '').slice(0, 5000));
            item.ele('link').txt(link);

            if (mainImg) item.ele('g:image_link').txt(mainImg);
            for (const u of additional.slice(0, 10)) item.ele('g:additional_image_link').txt(u);

            item.ele('g:availability').txt(mapAvailability(p.availability));
            item.ele('g:price').txt(`${Number(p.price || 0).toFixed(2)} ${CURRENCY}`);
            item.ele('g:condition').txt('new');

            item.ele('g:brand').txt('Charivna Craft');
            item.ele('g:identifier_exists').txt('false');

            if (p.Type?.name) item.ele('g:product_type').txt(`Handmade > ${p.Type.name}`);

            item.ele('g:content_language').txt(LANG);
            item.ele('g:target_country').txt('UA');
        }

        const xml = root.end({ prettyPrint: true });
        res.set('Content-Type', 'application/rss+xml; charset=UTF-8');
        res.send(xml);
    } catch (err) {
        next(err);
    }
});

module.exports = router;