const Router = require('express');
const router = new Router();


try {
    const productRouter = require('./productRouter');
    const typeRouter = require('./typeRouter');
    const userRouter = require('./userRouter');
    const cartRouter = require('./cartRouter');
    const orderRouter = require('./orderRouter');

    console.log("🧭 Mounting user routes");
    router.use('/user', userRouter);
    console.log("🧭 Mounting user routes");
    router.use('/type', typeRouter);
    console.log("🧭 Mounting user routes");
    router.use('/product', productRouter);
    console.log("🧭 Mounting user routes");
    router.use('/cart', cartRouter);
    console.log("🧭 Mounting user routes");
    router.use('/order', orderRouter);
} catch (e) {
    console.error("❌ ROUTER ERROR:", e);
    throw e;
}

module.exports = router;
