const fs = require('fs')

if (fs.existsSync('config.env')){
    require('dotenv').config({ path: './config.env'});
}

const env = {
    STRING_SESSION: process.env.STRING_SESSION === undefined ? '' : process.env.STRING_SESSION,
    HEROKU: process.env.HEROKU === undefined ? false : true,
    PREFIX: process.env.PREFIX === undefined ? /^[.?!]/g : process.env.PREFIX,
    COUNTRY_CODE: process.env.COUNTRY_CODE === undefined ? "91" : process.env.COUNTRY_CODE,
    OCR_API_KEY: process.env.OCR_API_KEY === undefined ? "9ffb44def388957" : process.env.OCR_API_KEY
}

module.exports = env