const con = require('./core/sessionString.js')
const fs = require('fs')
const chalk = require('chalk')

async function generateStringSession() {
    try{
        await con.saveSession();
    } catch (err) {
        console.log("Stopped.")
        process.exit(1)
    }
}

generateStringSession();