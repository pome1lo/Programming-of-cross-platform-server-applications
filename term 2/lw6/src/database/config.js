const {Sequelize} = require("sequelize");

const sequelize = new Sequelize('PSCP', 'sa', 'sa', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            trustServerCertificate: true,
        },
    },
});

module.exports = sequelize;