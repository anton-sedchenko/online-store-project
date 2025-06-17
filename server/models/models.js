const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
});

const Cart = sequelize.define('cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const CartFigure = sequelize.define('cart_figure', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

const Figure = sequelize.define('figure', {
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

const OrderFigure = sequelize.define('order_figure', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1}
});

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartFigure);
CartFigure.belongsTo(Cart);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderFigure);
OrderFigure.belongsTo(Order);

Figure.hasMany(OrderFigure);
OrderFigure.belongsTo(Figure);

Type.hasMany(Figure);
Figure.belongsTo(Type);

Figure.hasMany(CartFigure);
CartFigure.belongsTo(Figure);

module.exports = {
    User,
    Cart,
    CartFigure,
    Figure,
    Type,
    Order,
    OrderFigure
}
