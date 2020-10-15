require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        operatorsAliases: 0
        // dialectOptions: {
        //     useUTC: false // for reading from database
        // },
        // timezone: 'Europe/Berlin'
    // "logging": process.env.LOGGING
    },
    test: {
        username: 'root',
        password: null,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        storage: process.env.STORAGE,
        operatorsAliases: 0,
        logging: false,
        debug: 0
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        operatorsAliases: 0,
        debug: process.env.DEBUG || 0,
        logging: process.env.LOGGING || false
    }
};