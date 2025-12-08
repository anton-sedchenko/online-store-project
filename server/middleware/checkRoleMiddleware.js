const jwt = require('jsonwebtoken');

// Перевірка чи користувач є адміном для редагування товарів
module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Немає авторизації' });
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (decoded.role !== role) {
                console.log("Недостатньо прав. Роль:", decoded.role);
                return res.status(403).json({ message: 'Недостатньо прав' });
            }

            req.user = decoded;
            next();
        } catch (e) {
            console.log("Помилка токена:", e.message);
            return res.status(401).json({ message: 'Користувач не авторизований' });
        }
    }
}
