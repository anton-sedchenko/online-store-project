const {Router} = require('express');
const {create} = require('xmlbuilder2');
const {Product, ProductImage, Type} = require('../models/models');

const router = Router();

// простий in-memory кеш, щоб не навантажувати БД при кожному запиті
const CACHE_TTL_MS = 120000; // 2 хв
let cachedXml = null;
let cachedAt = 0;

const now = () => Date.now();

function mapAvailability(av) {
    // стани товару: 'IN_STOCK' | 'MADE_TO_ORDER' | 'OUT_OF_STOCK'
    if (av === 'IN_STOCK') return {available: 'true', stock: '1', madeToOrder: false};
    if (av === 'MADE_TO_ORDER') return {available: 'true', stock: '1', madeToOrder: true};
    return {available: 'false', stock: '0', madeToOrder: false}; // OUT_OF_STOCK або будь-що інше
}

router.get('/rozetka.xml', async (req, res, next) => {
    try {
        // кеш
        if (cachedXml && (now() - cachedAt) < CACHE_TTL_MS) {
            res.set('Content-Type', 'application/xml; charset=utf-8');
            return res.send(cachedXml);
        }

        // базова URL магазину
        const baseUrl = process.env.BASE_URL || 'https://charivna-craft.com.ua';

        // 1) тягнемо товари з пов'язаними фото та типами
        const products = await Product.findAll({
            include: [
                {model: ProductImage, as: 'images'},
                {model: Type} // Product.belongsTo(Type) без alias, доступ буде як p.type
            ],
            order: [['id', 'ASC']]
        });

        // 2) будуємо XML
        const doc = create({version: '1.0', encoding: 'UTF-8'})
            .ele('yml_catalog', {date: new Date().toISOString().slice(0, 16).replace('T', ' ')})
            .ele('shop');

        doc.ele('name').txt('Charivna Craft').up()
            .ele('company').txt('Charivna Craft').up()
            .ele('url').txt(baseUrl).up();

        const currencies = doc.ele('currencies');
        currencies.ele('currency', { id: 'UAH', rate: '1' }).up();
        currencies.up();

        // категорії, беремо лише ті, що реально присутні у вибірці товарів
        const categories = doc.ele('categories');
        const seen = new Set();
        for (const p of products) {
            if (p.type && !seen.has(p.type.id)) {
                const cid = p.type.rozetkaCategoryId || p.type.id;
                categories.ele('category', {id: String(cid)}).txt(p.type.name).up();
                seen.add(p.type.id);
            }
        }
        categories.up();

        const offers = doc.ele('offers');

        for (const p of products) {
            const {available, stock, madeToOrder} = mapAvailability(p.availability);
            const categoryId = p.type?.rozetkaCategoryId || p.type?.id || 1;

            const offer = offers.ele('offer', {id: String(p.id), available});

            // ціна / валюта / категорія
            offer.ele('price').txt(Number(p.price).toFixed(2)).up();
            offer.ele('currencyId').txt('UAH').up();
            offer.ele('categoryId').txt(String(categoryId)).up();

            // картинки: спершу головне фото img, потім додаткові з product_images
            const pics = [];
            if (p.img && /^https?:\/\//i.test(p.img)) pics.push(p.img);
            for (const im of (p.images || [])) {
                if (im.url && /^https?:\/\//i.test(im.url)) pics.push(im.url);
            }
            // видаляємо дублікати
            const uniquePics = [...new Set(pics)];
            uniquePics.forEach(url => offer.ele('picture').txt(url).up());

            // обов’язкові/корисні атрибути
            offer.ele('vendor').txt('Charivna Craft').up();
            if (p.code) offer.ele('article').txt(p.code).up();          // твій артикул
            offer.ele('stock_quantity').txt(stock).up();                 // ключове поле для Rozetka

            // назва та опис
            offer.ele('name').txt(p.name).up();
            if (p.description) {
                offer.ele('description').dat(`<p>${p.description}</p>`).up();
            }

            // параметри
            if (madeToOrder) {
                offer.ele('param', {name: 'Готовність'}).txt('Виготовлення ~1 доба').up();
            }
            offer.ele('param', {name: 'Країна-виробник товару'}).txt('Україна').up();

            offer.up(); // </offer>
        }

        offers.up(); // </offers>

        const xml = doc.end({prettyPrint: true});

        // кешуємо
        cachedXml = xml;
        cachedAt = now();

        res.set('Content-Type', 'application/xml; charset=utf-8');
        return res.send(xml);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;