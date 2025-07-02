const {Sequelize} = require('sequelize');

module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // вимикає зайвий консоль лог
});
