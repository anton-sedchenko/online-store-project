const Router = require('express');
const router = new Router();
const productRouter = require('./productRouter');
const typeRouter = require('./typeRouter');
const userRouter = require('./userRouter');
const cartRouter = require('./cartRouter');
const orderRouter = require('./orderRouter');

try {
    router.use('/user', userRouter);
    router.use('/type', typeRouter);
    router.use('/product', productRouter);
    router.use('/cart', cartRouter);
    router.use('/order', orderRouter);
} catch (e) {
    console.error("❌ ROUTER ERROR:", e);
    throw e;
}

module.exports = router;
