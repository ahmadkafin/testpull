const _data = require('./data/generate.data');
const iptv = require('iptv-checker-module');
const _input = require('./helpers/input.helpers');

const whatsapp = require('./logic/whatsapp.logic');



async function main() {
    await whatsapp.chat();
    // await _input.inputToTableServiceReport();
    // await _input.inputToTableCctvReport();
}

main();