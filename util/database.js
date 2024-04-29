const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodecomplete', process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: 'db'
});

module.exports = sequelize;
