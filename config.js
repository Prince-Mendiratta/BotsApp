const fs = require('fs')
const { DataTypes, Sequelize } = require('sequelize');
if (fs.existsSync('config.env')){
    require('dotenv').config({ path: './config.env'});
}

function convertToBool(value) {
    var bool = false;
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
            bool = true;
        }
    }
    else {

    }
    return bool;
};

const env = {
    STRING_SESSION: process.env.STRING_SESSION === undefined ? '' : process.env.STRING_SESSION,
    HEROKU: process.env.HEROKU === undefined ? false : true,
    PREFIX: process.env.PREFIX === undefined ? /^[.?!]/g : process.env.PREFIX,
    COUNTRY_CODE: process.env.COUNTRY_CODE === undefined ? "91" : process.env.COUNTRY_CODE,
    DATABASE_URL: process.env.DATABASE_URL === undefined ? './BotsApp.db' : process.env.DATABASE_URL,
    DEBUG: process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG),
    DATABASE: process.env.DATABASE_URL === './BotsApp.db' ? new Sequelize({ dialect: "sqlite", storage: process.env.DATABASE_URL, logging: process.env.DEBUG }) : new Sequelize({ dialect: "postgres", storage: process.env.DATABASE_URL}),
}

module.exports = env