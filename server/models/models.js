const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: {type: DataTypes.STRING, allowNull: true},
    lastName: {type: DataTypes.STRING, allowNull: true},
    email: {type: DataTypes.STRING, unique: true},
    phone: {type: DataTypes.STRING, allowNull: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
});

const Cart = sequelize.define('cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const CartProduct = sequelize.define('cart_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    img: {type: DataTypes.STRING, allowNull: false},
    code: {type: DataTypes.STRING, allowNull: false, unique: true},
});

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fullName: {type: DataTypes.STRING, allowNull: false},
    tel: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    comments: {type: DataTypes.TEXT, allowNull: true},
});

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1}
});

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartProduct);
CartProduct.belongsTo(Cart);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);

Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

Type.hasMany(Product);
Product.belongsTo(Type);

Product.hasMany(CartProduct);
CartProduct.belongsTo(Product);

module.exports = {
    User,
    Cart,
    CartProduct,
    Product,
    Type,
    Order,
    OrderProduct
}
