const config = require('../config')
const { DataTypes, Sequelize, Model } = require('sequelize');
const sequelize = config.DATABASE;

const Greeting = sequelize.define('Greeting', {
    chat:{
        type: DataTypes.STRING,
        allowNull: false
    },
    greetingType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    welcome: {
        type: DataTypes.TEXT
    },
    goodbye: {
        type: DataTypes.TEXT
    }
    }, {
        tableName: "Greetings"
});

async function getMessage(jid= null) {
    
    var Msg = await Greetings.findAll({
        where: {
            chat: jid,
        }
    });

    if (Msg.length < 1) {
        return false;
    } else {
        return Msg[0].dataValues;
    }
}

async function setWelcome(jid = null, text = null ) {
    
   
    await Greetings.sync()
        const [ created] = await Greetings.findOrCreate({
        where: { chat : jid },
        defaults: {
          welcome : text
        }
      });
      

// catch(err){
//     console.log("ERROR: " + err); 
// }
   
}
async function setGoodbye(jid , tip = 'goodbye', text = null) {
    var Msg = await Greetings.findAll({
        where: {
            chat: jid,
            
        }
    });

    if (Msg.length < 1) {
        return await Greetings.create({ chat: jid, goodbye:text });
    } else {
        return await Msg[0].update({ chat: jid,  goodbye:text });
    }
}

async function deleteMessage(jid = null, tip = 'welcome') {
    var Msg = await Greetings.findAll({
        where: {
            chat: jid,
            
        }
    });

    return await Msg[0].destroy();
}

module.exports = {
    Greeting: Greeting,
    getMessage: getMessage,
    setWelcome: setWelcome,
    setGoodbye: setGoodbye,
    deleteMessage: deleteMessage
};

