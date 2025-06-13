const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require('../middleware/authMiddleware');

// створити замовлення якщо юзер залогінений
router.post('/', authMiddleware, orderController.createOrder);

// Для гостей передається масив order у тілі запиту
router.post('/guest', orderController.createOrder);

// Історія поточного користувача замовлень
router.get('/', authMiddleware, orderController.getMyOrders);

// Перегляд всіх замовлень для адміна
router.get('/all', authMiddleware, checkRole('ADMIN'), orderController.getAllOrders);

// Переглянути конкретне замовлення
router.get('/:id', authMiddleware, orderController.getOneOrder);

// оформити замовлення з кошика для ролі Гість. Передає CartId
router.post('/guest-cart', orderController.createOrderFromGuestCart);

module.exports = router;
