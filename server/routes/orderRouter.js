const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuthMiddleware");

// створити замовлення (і для гостя, і для юзера)
router.post("/", optionalAuth, orderController.createOrder)

// Історія поточного користувача замовлень
router.get("/", authMiddleware, orderController.getMyOrders);

// Перегляд всіх замовлень для адміна
router.get("/all", authMiddleware, checkRole("ADMIN"), orderController.getAllOrders);

// Переглянути конкретне замовлення
router.get("/:id", authMiddleware, orderController.getOneOrder);

module.exports = router;
