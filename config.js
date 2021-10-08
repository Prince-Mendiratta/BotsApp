const fs = require('fs')
const { DataTypes, Sequelize } = require('sequelize');
if (fs.existsSync('config.env')){
    require('dotenv').config({ path: './config.env'});
}

const convertToBool = (value) => {
    var bool = false;
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
            bool = true;
        }
    }
    return bool;
}

// Declare these environment variables first
process.env.DATABASE_URL = process.env.DATABASE_URL === undefined ? './BotsApp.db' : process.env.DATABASE_URL;
process.env.DEBUG = process.env.DEBUG === undefined ? true : false;

const env = {
    STRING_SESSION: process.env.STRING_SESSION === undefined ? '' : process.env.STRING_SESSION,
    HEROKU: process.env.HEROKU === undefined ? false : true,
    PREFIX: process.env.PREFIX === undefined ? /^[.?!]/g : process.env.PREFIX,
    COUNTRY_CODE: process.env.COUNTRY_CODE === undefined ? "91" : process.env.COUNTRY_CODE,
    DATABASE_URL: process.env.DATABASE_URL,
    DEBUG: process.env.DEBUG,
    DATABASE: process.env.DATABASE_URL === './BotsApp.db' ? new Sequelize({ dialect: "sqlite", storage: process.env.DATABASE_URL, logging: convertToBool(process.env.DEBUG) }) : new Sequelize({ dialect: "postgres", storage: process.env.DATABASE_URL}),
}

module.exports = env