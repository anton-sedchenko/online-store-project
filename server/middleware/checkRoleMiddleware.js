const jwt = require('jsonwebtoken');

// Перевірка чи користувач є адміном для редагування товарів
module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {

            console.log('🔐 checkRole running...');

            // отримуємо токен із заголовків
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({message: "Спершу треба авторизуватися"});
            }

            console.log('🔐 Роль користувача:', decoded.role);

            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (decoded.role !== role) {
                return res.status(403).json({message: "Доступ відсутній"});
            }
            req.user = decoded;
            next();
        } catch (e) {
            res.status(401).json({message: "Спершу треба авторизуватися"});
        }
    }
}
