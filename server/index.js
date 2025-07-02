require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT;
const app = express();
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',  // ваш React/Vite dev-сервер
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({
    createParentPath: true,      // автoстворює папки
    limits: {fileSize: 5e6},   // обмеження розміру
}));

// app.use(helmet()); тимчасово вимкнули щоб знайти баг

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 хвилин
    max: 100, // не більше 100 запитів з одного IP
});
app.use(limiter);



app.get('/api/ping', (req, res) => {
    res.send('pong');
});



app.use('/api', router);

// Замикаючий middleware - опрацювання помилок та передача відповіді клієнту
app.use(errorHandler);

const start = async () => {
    try {

        console.log('Connecting to DB...');

        await sequelize.authenticate();

        console.log('DB Connected.');

        await sequelize.sync({alter: true});

        console.log('DB Synced.');

        if (!PORT) {
            throw new Error('PORT is not defined!');
        }

        console.log('Starting server...');
        console.log('ENV PORT:', process.env.PORT);

        // app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

        app.listen(PORT, err => {
            if (err) {
                console.error('Server failed to start:', err);
            } else {
                console.log(`Server started on port ${PORT}`);
            }
        });

        console.log(`Server is running on port ${PORT}`);
    } catch (e) {
        console.log(e);
    }
}

start();
