const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: true},
    email: {type: DataTypes.STRING, unique: true},
    phone: {type: DataTypes.STRING, allowNull: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    resetToken: {type: DataTypes.STRING, allowNull: true},
    resetTokenExpiry: {type: DataTypes.DATE, allowNull: true},
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
    img: {type: DataTypes.STRING},
    code: {type: DataTypes.STRING, allowNull: false, unique: true},
    width:     { type: DataTypes.TEXT, allowNull: true },
    length:    { type: DataTypes.TEXT, allowNull: true },
    height:    { type: DataTypes.TEXT, allowNull: true },
    diameter:  { type: DataTypes.TEXT, allowNull: true },
    weightKg:  { type: DataTypes.DECIMAL(10,3), allowNull: true },
    country:   { type: DataTypes.TEXT, allowNull: true },
    color:     { type: DataTypes.TEXT, allowNull: true },
    material:  { type: DataTypes.TEXT, allowNull: true },
    kind:      { type: DataTypes.TEXT, allowNull: true },  // тип виробу
    availability: {
        type: DataTypes.STRING, // було ENUM
        allowNull: false,
        defaultValue: 'MADE_TO_ORDER',
        validate: {
            isIn: [['IN_STOCK', 'MADE_TO_ORDER', 'OUT_OF_STOCK']]
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1, max: 10 }
    },
    slug: {type: DataTypes.STRING, unique: true},
    rozetkaCategoryId: {type: DataTypes.BIGINT, allowNull: true},
});

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    image: {type: DataTypes.STRING, allowNull: true},
    parentId: {type: DataTypes.INTEGER, allowNull: true},
    rozetkaCategoryId: {type: DataTypes.INTEGER, allowNull: true},
});

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fullName: {type: DataTypes.STRING, allowNull: false},
    tel: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    comments: {type: DataTypes.TEXT, allowNull: true},
    shipping: {type: DataTypes.JSONB, allowNull: true},
});

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1}
});

const ProductImage = sequelize.define('product_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    url: {type: DataTypes.STRING, allowNull: false},
});

const Article = sequelize.define('article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false, unique: true},
    slug: {type: DataTypes.STRING, allowNull: false, unique: true},
    content: {type: DataTypes.TEXT, allowNull: false},
    image: {type: DataTypes.STRING, allowNull: true},
});

const Review = sequelize.define('review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // для верхнього рівня відгуків parentId = null; для відповіді — id батьківського відгуку
    parentId: { type: DataTypes.INTEGER, allowNull: true },
    rating: { type: DataTypes.INTEGER, allowNull: true, validate: { min:1, max:5 } }, // тільки для верхнього рівня
    text: { type: DataTypes.TEXT, allowNull: true },
}, {
    paranoid: false,
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

Product.hasMany(ProductImage, {as: 'images'});
ProductImage.belongsTo(Product);

Product.hasMany(Review, {foreignKey: 'productId'});
Review.belongsTo(Product, {foreignKey: 'productId'});

User.hasMany(Review, {foreignKey: 'userId'});
Review.belongsTo(User, {foreignKey: 'userId'});

module.exports = {
    User,
    Cart,
    CartProduct,
    Product,
    Type,
    Order,
    OrderProduct,
    ProductImage,
    Article,
    Review,
}
