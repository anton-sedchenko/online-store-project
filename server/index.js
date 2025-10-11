require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const helmet = require('helmet');
const {create } = require('xmlbuilder2');
const {Article, Product} = require('./models/models');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('trust proxy', 1);
const rateLimit = require('express-rate-limit');
const {ProductImage} = require("./models/models");

// // --- CORS Setup ---
// const allowedOrigins = [
//     'http://localhost:3000',
//     'http://localhost:5173',
//     'https://charivna-craft.com.ua',
//     'https://www.charivna-craft.com.ua',
//     'https://charivna-craft-staging.vercel.app',
//     'https://online-store-project-git-staging-antonsedchenkos-projects.vercel.app',
//     'https://online-store-project.vercel.app'
// ];

// === HARD CORS (ручний, без пакетів) ===
const ALLOWED_ORIGINS = new Set([
    'http://localhost:3000',
    'http://localhost:5173',
    'https://charivna-craft.com.ua',
    'https://www.charivna-craft.com.ua',
    'https://charivna-craft-staging.vercel.app',
    'https://online-store-project-git-staging-antonsedchenkos-projects.vercel.app',
    'https://online-store-project.vercel.app'
]);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Дозволимо ВСІ *.vercel.app + whitelisted
    const allow =
        !origin ||
        ALLOWED_ORIGINS.has(origin) ||
        /\.vercel\.app$/i.test(origin);

    if (allow) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,POST,PUT,PATCH,DELETE,OPTIONS'
        );
        // Віддзеркалюємо заголовки, які просить браузер у preflight
        const reqHdr = req.headers['access-control-request-headers'];
        res.setHeader(
            'Access-Control-Allow-Headers',
            reqHdr || 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
    }

    if (req.method === 'OPTIONS') {
        // Завжди відповідати на preflight тут і зараз
        return res.sendStatus(204);
    }

    return allow
        ? next()
        : res.status(403).send('CORS: origin not allowed');
});
app.use(express.json());

app.use(express.urlencoded({extended: true}))  // для formData

app.use(fileUpload({
    useTempFiles: true,               // Cloudinary читає з тимчасового файлу
    tempFileDir: '/tmp/',            // тимчасова директорія (на Railway вона існує)
    limits: {fileSize: 5e6},
}));

app.use(helmet({
    crossOriginResourcePolicy: false,                 // важливо для крос-оригін ресурсів
    crossOriginOpenerPolicy: {policy: 'same-origin-allow-popups'}
}));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // не більше 100 запитів з одного IP
});
app.use('/api', apiLimiter);
app.use('/callback', apiLimiter);
app.use('/api', router);

// Генеруємо sitemap.xml динамічно
app.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = process.env.CLIENT_URL || 'https://charivna-craft.com.ua';

        // 1) Статичні сторінки (доповніть під себе)
        const staticUrls = [
            {loc: `${baseUrl}/`, changefreq: 'weekly', priority: 1.0},
            {loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: 0.7},
            {loc: `${baseUrl}/cart`, changefreq: 'weekly', priority: 0.3},
            {loc: `${baseUrl}/contacts`, changefreq: 'yearly', priority: 0.3},
            {loc: `${baseUrl}/order`, changefreq: 'weekly', priority: 0.3},
            {loc: `${baseUrl}/return-policy`, changefreq: 'yearly', priority: 0.3},
            {loc: `${baseUrl}/oferta`, changefreq: 'yearly', priority: 0.3},
            {loc: `${baseUrl}/delivery-payment`, changefreq: 'yearly', priority: 0.3},
            {loc: `${baseUrl}/privacy`, changefreq: 'yearly', priority: 0.3},
        ];

        // 2) Динаміка з БД
        const [articles, products] = await Promise.all([
            Article.findAll({attributes: ['slug', 'updatedAt'], order: [['createdAt','DESC']]}),
            Product.findAll({attributes: ['slug', 'updatedAt'], order: [['createdAt','DESC']]}),
        ]);

        const articleUrls = articles.map(a => ({
            loc: `${baseUrl}/blog/${a.slug}`,
            lastmod: a.updatedAt ? a.updatedAt.toISOString() : undefined,
            changefreq: 'weekly',
            priority: 0.7,
        }));

        const productUrls = products.map(p => ({
            loc: `${baseUrl}/product/${p.slug}`,
            lastmod: p.updatedAt ? p.updatedAt.toISOString() : undefined,
            changefreq: 'weekly',
            priority: 0.8,
        }));

        // 3) Склеюємо все і будуємо XML
        const urls = [...staticUrls, ...articleUrls, ...productUrls].map(u => {
            const node = { loc: u.loc };
            if (u.lastmod)    node.lastmod = u.lastmod;
            if (u.changefreq) node.changefreq = u.changefreq;
            if (u.priority != null) node.priority = u.priority;
            return node;
        });

        const xml = create({
            urlset: {
                '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
                url: urls,
            }
        }).end({prettyPrint: true});

        res.set('Cache-Control', 'public, max-age=3600'); // кеш 1 год
        res.type('application/xml').send(xml);
    } catch (err) {
        console.error('Error building sitemap:', err);
        res.sendStatus(500);
    }
});


// Замикаючий middleware - опрацювання помилок та передача відповіді клієнту
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();

        console.log('Connection has been established successfully.');

        // Обережно sequelize синхронізація для проду

        if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
            await sequelize.sync({alter: true});
            console.log(`Tables synced (${process.env.NODE_ENV})`);
        }

        // if (process.env.NODE_ENV === 'staging') {
        //     await sequelize.sync({alter: true});
        //     console.log('Tables synced (staging)');
        // }

        await ProductImage.sync();

        if (!PORT) throw new Error('PORT is not defined!');
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
