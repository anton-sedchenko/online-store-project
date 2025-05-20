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
});

const Figure = sequelize.define('figure', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.INTEGER, allowNull: false},
});

const Type = sequelize.define('figure', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
});

const FigureInfo = sequelize.define('figure_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
});

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartFigure);
CartFigure.belongsTo(Cart);

Type.hasMany(Figure);
Figure.belongsTo(Type);

Figure.hasMany(CartFigure);
CartFigure.belongsTo(Figure);

Figure.hasMany(FigureInfo);
FigureInfo.belongsTo(Figure);

module.exports = {
    User,
    Cart,
    CartFigure,
    Figure,
    Type,
    FigureInfo
}
