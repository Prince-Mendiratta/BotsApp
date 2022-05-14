import { AuthenticationCreds, AuthenticationState, BufferJSON, initAuthCreds, proto, SignalDataSet, SignalDataTypeMap } from '@adiwajshing/baileys'
import chalk from 'chalk';
import type { Logger } from 'pino';
import {Cred, Key} from '../database/auth';
const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
    'pre-key': 'preKeys',
    'session': 'sessions',
    'sender-key': 'senderKeys',
    'app-state-sync-key': 'appStateSyncKeys',
    'app-state-sync-version': 'appStateVersions',
    'sender-key-memory': 'senderKeyMemory'
}


const useRemoteFileAuthState = async (logger: Logger) => {
    // require fs here so that in case "fs" is not available -- the app does not crash
    const { readFileSync, writeFileSync, existsSync } = require('fs');
    let creds: AuthenticationCreds;
    let keys = {};

    const checkCreds = async (): Promise<boolean> => {
        const lock = await Cred.findOne({
            where: {
                key: 'noiseKey'
            }
        })
        if(lock){
            return true;
        }else{
            return false;
        }
    }

    const loadCreds = async () => {
        const allCreds = await Cred.findAll();
        let temp = {};
        allCreds.forEach((res) => {
            let val = res.getDataValue('value');
            let key = res.getDataValue('key');
            val = JSON.parse(val, BufferJSON.reviver);
            temp[key] = val;
        })

        return temp;
    }

    const loadKeys = async () => {
        let keys = {
            preKeys: {},
            sessions: {},
            senderKeys: {},
            appStateSyncKeys: {},
            appStateVersions: {},
            senderKeyMemory: {}
        }
        const allKeys = await Key.findAll();
        allKeys.forEach((res) => {
            let val = res.getDataValue('value');
            let key = res.getDataValue('key');
            let type = res.getDataValue('type');
            val = JSON.parse(val, BufferJSON.reviver);
            keys[type][key] = val;
        })

        return keys;
    }

    const saveCreds = async (data?: Partial<AuthenticationCreds>): Promise<void> => {
        if (!data) {
            console.log('Saving all creds');
            data = creds;
        }
        for (const _key in data) {
            const cred = await Cred.findOne({
                where: {
                    key: _key
                }
            });
            if (cred) {
                await cred.update({
                    value: JSON.stringify(data[_key], BufferJSON.replacer, 2)
                }).then((res) => { console.log(`updated value ${_key} `) }).catch(err => { console.log(chalk.whiteBright(err)) });
            } else {
                await Cred.create({
                    key: _key,
                    value: JSON.stringify(data[_key], BufferJSON.replacer, 2)
                }).then((res) => { console.log(`inserted value ${_key}`) }).catch(err => { console.log(chalk.whiteBright(err)) });
            }
        }
    }

    const saveKey = async (key: string, data: SignalDataSet, _key: string): Promise<void> => {
        for(const subKey in data[_key]){
        // console.log(`Trying to find key ${key} and subKey ${subKey}.`);
            const res = await Key.findOne({
                where: {
                    key: subKey,
                    type: key
                }
            });
            if (res) {
                await res.update({
                    value: JSON.stringify(data[_key][subKey], BufferJSON.replacer, 2)
                }).then((res) => { 
                    // console.log(`updated key ${key} and subKey ${subKey}`)
                }).catch(err => { console.log(chalk.blueBright(err)) });
            } else {
                await Key.create({
                    key: subKey,
                    value: JSON.stringify(data[_key][subKey], BufferJSON.replacer, 2),
                    type: key
                }).then((res) => {
                    // console.log(`inserted key ${key} and subKey ${subKey}`) 
                }).catch(err => { console.log(chalk.blueBright(err)) });
            }
        }
        return;
    }

    let credsExist: boolean = await checkCreds();
    if (credsExist) {
        console.log('loading values back.');
        let parent = {
            creds: {},
            keys: {}
        }
        const allCreds = await loadCreds();
        const allKeys = await loadKeys();

        parent.creds = allCreds;
        parent.keys = allKeys;

        const final = JSON.parse(JSON.stringify(parent), BufferJSON.reviver);
        // console.log(final);
        creds = final.creds;
        keys = final.keys;
    }
    else {
        creds = initAuthCreds();
        keys = {};
        saveCreds();
    }

    return {
        state: {
            creds,
            keys: {
                get: (type: string, ids: any[]) => {
                    const key: string = KEY_MAP[type];
                    return ids.reduce((dict, id) => {
                        let _a: { [x: string]: any; };
                        let value = (_a = keys[key]) === null || _a === void 0 ? void 0 : _a[id];
                        if (value) {
                            if (type === 'app-state-sync-key') {
                                value = proto.AppStateSyncKeyData.fromObject(value);
                            }
                            dict[id] = value;
                        }
                        return dict;
                    }, {});
                },
                set: async (data: SignalDataSet) => {
                    for (const _key in data) {
                        const key: string = KEY_MAP[_key];
                        // console.log(`Got raw key - ${_key} and got mapped key ${key}. The value is ${data[_key]}`)
                        keys[key] = keys[key] || {};
                        Object.assign(keys[key], data[_key]);
                        await saveKey(key, data, _key);
                    }
                    // saveState();
                }
            }
        },
        saveCreds
    };
};

export default useRemoteFileAuthState;