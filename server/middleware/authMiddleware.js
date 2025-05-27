const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") { // Цікавлять лише методи Get, Post, Put, Delete
        next();
    }
    try {
        // отримуємо токен із заголовків
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: "Спершу треба авторизуватися"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Додаємо в ріквест поле Юзера отримані дані, щоб він був доступний у всіх функціях
        next(); // Викликаємо наступний middleWare в ланцюгу
    } catch (e) {
        res.status(401).json({message: "Спершу треба авторизуватися"});
    }
}
