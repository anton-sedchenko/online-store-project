const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

router.post('/guest/init', cartController.initGuestCart);
router.post('/guest/add', cartController.addToCartGuest);
router.get('/guest', cartController.getGuestCart);
router.delete('/guest/remove', cartController.removeFromCartGuest);
router.delete('/guest/clear', cartController.clearGuestCart);
router.post('/', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/', authMiddleware, cartController.removeFromCart);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;
