const con = require('./core/sessionString.js')
const fs = require('fs')
const chalk = require('chalk')

function generateStringSession () {
    console.log(chalk.yellow.bold("Make sure you copy the string properly!\n\n"))
    try{
        con.saveSession();
    } catch (err) {
        console.log("Stopped.")
    }
}

generateStringSession();