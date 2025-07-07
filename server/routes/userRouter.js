const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
// Перевірка користувача на авторизацію
router.get('/auth', authMiddleware, userController.checkAuth);
router.put('/profile',  authMiddleware, userController.updateProfile);
router.put('/password', authMiddleware, userController.changePassword);
router.post('/request-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
