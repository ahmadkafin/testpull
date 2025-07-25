const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');

const _input = require('../helpers/input.helpers');
const _data = require('../data/generate.data');

const client = new Client();

let dataPage = async () => {
    let data = await _data.pageData('http://10.129.10.138/digio2021/');
    await _input.inputToTablePageReport('http://10.129.10.138/digio2021/');
    let string = data.msgRes.join('\n');
    return string;
}

let dataService = async () => {
    let data = await _data.serviceData();
    await _input.inputToTableServiceReport();
    let string = data.msgRes.join('\n');
    return string;
}

let dataServer = async () => {
    let data = await _data.serverData();
    await _input.inputToTableServerReport();
    let string = data.msgRes.join('\n');
    return string;
}

let dataCctv = async () => {
    let data = await _data.cctvData();
    await _input.inputToTableCctvReport();
    let string = data.msgRes.join('\n');
    return string;
}

exports.chat = async () => {
    // generate qr code
    client.on('qr', (qr) => {
        console.log('QR Received : ', qr);
        qrcode.generate(qr);
    });

    // qrcode scanned
    client.on('ready', async () => {
        console.log('Client is ready to chat!');
        console.log('Chat sequence begin, start timer');
        const number = '6281312425757';

        // setTimeout(() => {
        //     client.sendMessage(`120363043461239894@g.us`, 'test for one minute chat');
        // }, 6000)

        const date = new Date();
        const hour = date.getTime();
        let greetings = hour == 7 ? 'Pagi' : hour == 12 ? 'Siang' : hour == 16 ? 'Sore' : 'Malam'
        cron.schedule('30 7 * * *', async () => {
            let datapage = await dataPage();
            let dataserver = await dataServer();
            let datacctv = await dataCctv()
            let dataservice = await dataService();
            client.sendMessage(`120363043461239894@g.us`, `Selamat Pagi berikut report cctv untuk Pagi ini :\n${datacctv}`).then(() => {
                client.sendMessage(`120363043461239894@g.us`, `report page :\n ${datapage}`).then(() => {
                    client.sendMessage(`120363043461239894@g.us`, `report server:\n ${dataserver}`).then(() => {
                        client.sendMessage(`120363043461239894@g.us`, `report service:\n ${dataservice}`).then(() => {
                            console.log('messages sent');
                        });
                    });
                });
            });
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });

        cron.schedule('00 12 * * *', async () => {
            let datapage = await dataPage();
            let dataserver = await dataServer();
            let datacctv = await dataCctv()
            let dataservice = await dataService();
            client.sendMessage(`120363043461239894@g.us`, `Selamat Siang berikut report cctv untuk Siang ini :\n${datacctv}`).then(() => {
                client.sendMessage(`120363043461239894@g.us`, `report page :\n ${datapage}`).then(() => {
                    client.sendMessage(`120363043461239894@g.us`, `report server:\n ${dataserver}`).then(() => {
                        client.sendMessage(`120363043461239894@g.us`, `report service:\n ${dataservice}`).then(() => {
                            console.log('messages sent');
                        });
                    });
                });
            });
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });

        cron.schedule('30 16 * * *', async () => {
            let datapage = await dataPage();
            let dataserver = await dataServer();
            let datacctv = await dataCctv()
            let dataservice = await dataService();
            client.sendMessage(`120363043461239894@g.us`, `Selamat Sore berikut report cctv untuk Sore ini :\n${datacctv}`).then(() => {
                client.sendMessage(`120363043461239894@g.us`, `report page :\n ${datapage}`).then(() => {
                    client.sendMessage(`120363043461239894@g.us`, `report server:\n ${dataserver}`).then(() => {
                        client.sendMessage(`120363043461239894@g.us`, `report service:\n ${dataservice}`).then(() => {
                            console.log('messages sent');
                        });
                    });
                });
            });
        }, {
            scheduled: true,
            timezone: "Asia/Jakarta"
        });
    });

    // logic command on message
    client.on('message', async msg => {
        const chats = await msg.getChat();
        const contact = await msg.getContact();

        if (chats.isGroup) {
            if (msg.body.includes('Windi') || msg.body.includes('windi')) {
                switch (msg.body) {
                    // works
                    case 'Windi kondisi page': msg.reply('memproses...').then(async () => {
                        await dataPage().then(res => {
                            let msgRes = res.msgRes
                            setTimeout(() => {
                                chats.sendMessage(`Hello @${contact.id.user} berikut hasil penelusuran Windi:\n${msgRes}`, { mentions: [contact] })
                            }, 1000);
                        });
                    }); break;

                    case 'Windi kondisi MAP SERVICE': msg.reply('memproses...').then(async () => {
                        await dataService().serverData().then(res => {
                            setTimeout(() => {
                                let msgRes = res.msgRes;
                                chats.sendMessage(`Hello @${contact.id.user} berikut hasil penelusuran Windi:\n${msgRes}`, { mentions: [contact] })
                            }, 1000);
                        })
                    }); break;

                    case 'Windi diagnosa sambungan ke semua server saat ini': msg.reply('memproses...').then(async () => {
                        await dataServer().serverData().then(res => {
                            let msgRes = res.msgRes;
                            chats.sendMessage(`Hello @${contact.id.user} berikut hasil penelusuran Windi:\n${msgRes}`, { mentions: [contact] });
                        });
                    }); break;

                    case 'Windi diagnosa cctv': msg.reply('memproses...').then(async () => {
                        await dataCctv().cctvData().then(res => {
                            let msgRes = res.msgRes;
                            chats.sendMessage(`Hellow @${contact.id.user} berikut hasil penelusuran Windi:\n${msgRes}`, { mentions: [contact] })
                        })
                    }); break;

                    // fun
                    case 'Windi kamu pinter': chats.sendMessage(`Terima kasih pak @${contact.id.user}`, { mentions: [contact] }); break;
                    default: chats.sendMessage(`Mohon maaf @${contact.id.user}, perintah tidak dikenali.`);
                }
            }
        }

        console.log(`Message received from ${msg.from}: ${msg.body}`);
    });

    client.initialize();
}