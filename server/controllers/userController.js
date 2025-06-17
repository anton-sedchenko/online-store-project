const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Cart} = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
};

class UserController {
    async registration(req, res, next) {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Некоректний email або пароль'));
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return next(ApiError.badRequest('Користувач з таким email вже існує'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({
            email,
            role: "USER",
            password: hashPassword
        });
        const cart = await Cart.create({userId: user.id});
        const token = generateJwt(user.id, user.email, user.role);

        return res.json({token});
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        // Перевіряємо чи є користувач у базі
        if (!user) {
            return next(ApiError.internal('Користувач не знайдений'));
        }
        // Порівнюємо паролі користувача з паролем в базі
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Вказано невірний пароль'));
        }
        // Генеруємо токен та повертаємо на клієнт
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
    }

    async checkAuth(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id, { attributes: ['id','email','role'] });
            return res.json(user);
        } catch(e) { next(ApiError.internal(e.message)); }
    }
}

module.exports = new UserController();
