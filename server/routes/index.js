const Router = require('express');
const router = new Router();
const productRouter = require('./productRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');
const articleRouter = require('./articleRouter');
const callbackRouter = require('./callbackRouter')

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);
router.use('/article', articleRouter);
router.use('/callback', callbackRouter);

module.exports = router;
