const fs = require('fs')
const { DataTypes, Sequelize } = require('sequelize');
if (fs.existsSync('config.env')){
    require('dotenv').config({ path: './config.env'});
}else{
    require('dotenv');
}

const convertToLogLevel = (value) => {
    var log = false;
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
            log = console.log;
        }
    }
    return log;
}

// Declare these environment variables first
process.env.DATABASE_URL = process.env.DATABASE_URL === undefined ? './BotsApp.db' : process.env.DATABASE_URL;
process.env.DEBUG = process.env.DEBUG === undefined ? false : process.env.DEBUG;

const env = {
    STRING_SESSION: process.env.STRING_SESSION === undefined ? '' : process.env.STRING_SESSION,
    HEROKU: process.env.HEROKU === undefined ? false : true,
    PREFIX: process.env.PREFIX === undefined ? "^[.?!]" : process.env.PREFIX,
    COUNTRY_CODE: process.env.COUNTRY_CODE === undefined ? "91" : process.env.COUNTRY_CODE,
    OCR_API_KEY: process.env.OCR_API_KEY === undefined ? "9ffb44def388957" : process.env.OCR_API_KEY,
    WEATHER_API_KEY:
        process.env.CURRENT_WEATHER_API_KEY === undefined
            ? "6729ac2b2e2bb5c686ff427a2f06df92"
            : process.env.CURRENT_WEATHER_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DEBUG: process.env.DEBUG,
    DATABASE: process.env.DATABASE_URL === './BotsApp.db' ? new Sequelize({ dialect: "sqlite", storage: process.env.DATABASE_URL, logging: convertToLogLevel(process.env.DEBUG) }) : new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres', protocol: 'postgres', logging: convertToLogLevel(process.env.DEBUG), dialectOptions: {ssl: {require: true, rejectUnauthorized: false}}}),
    WORK_TYPE: process.env.WORK_TYPE === undefined ? "private" : process.env.WORK_TYPE,
    SUDO: process.env.SUDO === undefined ? "" : process.env.SUDO,
}

module.exports = env