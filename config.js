const fs = require('fs')

if (fs.existsSync('config.env')){
    require('dotenv').config({ path: './config.env'});
}

const env = {
    STRING_SESSION: process.env.STRING_SESSION === undefined ? '' : process.env.STRING_SESSION,
    HEROKU: process.env.HEROKU === undefined ? false : true,
    PREFIX: process.env.PREFIX === undefined ? /^[.?!]\S/g : process.env.PREFIX
}

module.exports = env