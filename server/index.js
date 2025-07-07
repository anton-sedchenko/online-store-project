require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const helmet = require('helmet');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('trust proxy', 1);
const rateLimit = require('express-rate-limit');

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://online-store-project-navy.vercel.app',
        'https://online-store-project-git-main-antonsedchenkos-projects.vercel.app',
        'https://charivna-craft.com.ua'
    ],
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,               // Cloudinary читає з тимчасового файлу
    tempFileDir: '/tmp/',            // тимчасова директорія (на Railway вона існує)
    limits: {fileSize: 5e6},
}));

// app.use(helmet()); тимчасово вимкнули щоб знайти баг

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // не більше 100 запитів з одного IP
});
app.use(limiter);

app.use('/api', router);
// Замикаючий middleware - опрацювання помилок та передача відповіді клієнту
app.use(errorHandler);

// Віддавати статичні файли з React
app.use(express.static(path.resolve(__dirname, '..', 'client', 'dist')));

// Для будь-якого GET-запиту, що не /api/... — повертати index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});

const start = async () => {
    try {
        console.log("🔌 Using DB:", process.env.DATABASE_URL);
        await sequelize.authenticate();
        await sequelize.sync({force: true});

        if (!PORT) throw new Error('PORT is not defined!');
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
