import config from "../config";
import { DataTypes, InferAttributes, Model, InferCreationAttributes, Sequelize } from "sequelize";

const sequelize: Sequelize = config.DATABASE;

class Blacklist extends Model<InferAttributes<Blacklist>, InferCreationAttributes<Blacklist>> {
    declare JID: string;
    declare GRPID: string;
}

Blacklist.init({
    JID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    GRPID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {sequelize, tableName: "Blacklist"});

async function addBlacklistUser(jid: string = "", GrpId: string = "") : Promise<void> {
    Blacklist.findOrCreate({
        where: {
            JID: jid,
            GRPID: GrpId,
        },
    });
}

async function getBlacklistUser(jid: string = "", GrpId: string = "") : Promise<boolean> {
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

async function removeBlacklistUser(jid: string = "", GrpId: string = "") : Promise<boolean | void> {
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

export = {
    Blacklist: Blacklist,
    addBlacklistUser: addBlacklistUser,
    getBlacklistUser: getBlacklistUser,
    removeBlacklistUser: removeBlacklistUser,
};
