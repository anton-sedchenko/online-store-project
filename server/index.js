require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const helmet = require('helmet');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('trust proxy', 1);
const rateLimit = require('express-rate-limit');
const {ProductImage} = require("./models/models");

// Для staging (і всіх preview-доменів) дозволяємо будь-який origin,
// в деві - лишаєм статичний список
if (process.env.NODE_ENV === 'staging') {
    app.use(cors({origin: true, credentials: true}));
} else {
    const corsOptions = {
        origin: [
        'http://localhost:3000',
        'https://charivna-craft.com.ua',
        // якщо є інші production-домени — сюди
        ],
        methods: ['GET','POST','PUT','DELETE','OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization'],
        credentials: true,
    };
    app.use(cors(corsOptions));
}

app.use(express.json());

app.use(express.urlencoded({extended: true}))  // для formData

app.use(fileUpload({
    useTempFiles: true,               // Cloudinary читає з тимчасового файлу
    tempFileDir: '/tmp/',            // тимчасова директорія (на Railway вона існує)
    limits: {fileSize: 5e6},
}));

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // не більше 100 запитів з одного IP
});
app.use(limiter);

app.use('/api', router);
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
