const git = require('simple-git')()
// const path = ''
const chalk = require('chalk');
const exec = require('child_process').exec;

const gitPull = async () => {
    console.log(chalk.yellowBright.bold("[INFO] Checking for updates..."));
    await git.fetch();
    var newCommits = await git.log(['main..origin/main'])
    if (newCommits.total) {
        console.log(chalk.blueBright("[INFO] New Update pending, updating..."));
        await git.pull("origin", "main", (err, update) => {
            if(update && update.summary.changes){
                if(update.files.includes('package.json')){
                    exec('npm install').stderr.pipe(process.stderr);
                }
                console.log(chalk.greenBright.bold("[INFO] Updated the bot with latest changes."));
            }else if(err){
                console.log(chalk.redBright.bold("[ERROR] Could not pull latest changes!"));
                console.log(err);
            }
        });
    }else{
        console.log(chalk.greenBright.bold("[INFO] Bot is already working on latest version."));
    }
}

module.exports = gitPull