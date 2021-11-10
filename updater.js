const gitPull = require('./core/gitpull');

update = async () => {
    await gitPull();
}

update();