const config = require("../config");
const { DataTypes } = require("sequelize");
const sequelize = config.DATABASE;

const Blacklist = sequelize.define(
    "Blacklist",
    {
        JID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        GRPID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "Blacklist",
    }
);

async function addBlacklistUser(jid = "", GrpId = "") {
    Blacklist.findOrCreate({
        where: {
            JID: jid,
            GRPID: GrpId,
        },
    });
}

async function getBlacklistUser(jid = "", GrpId = "") {
    var Msg = await Blacklist.findAll({
        where: {
            JID: "",
            GRPID: GrpId,
        },
    });

    if (Msg.length < 1) {
        var Msg = await Blacklist.findAll({
            where: {
                JID: jid,
                GRPID: "",
            },
        });

        if (Msg.length < 1) {
            var Msg = await Blacklist.findAll({
                where: {
                    JID: jid,
                    GRPID: GrpId,
                },
            });

            if (Msg.length < 1) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        return true;
    }
}

async function removeBlacklistUser(jid = "", GrpId = "") {
    var Msg = await Blacklist.findAll({
        where: {
            JID: jid,
            GRPID: GrpId,
        },
    });
    if (Msg.length < 1) {
        return false;
    } else {
        return await Msg[0].destroy();
    }
}

module.exports = {
    Blacklist: Blacklist,
    addBlacklistUser: addBlacklistUser,
    getBlacklistUser: getBlacklistUser,
    removeBlacklistUser: removeBlacklistUser,
};
