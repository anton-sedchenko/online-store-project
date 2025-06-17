const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');

module.exports = function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // якщо нема токена — просто гість
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // кладаємо дані юзера в req.user
        req.user = {id: decoded.id, email: decoded.email, role: decoded.role};
        return next();
    } catch (err) {
        // якщо токен невалідний — повертаємо 401
        return next(ApiError.unauthorized('Невірний токен'));
    }
};
