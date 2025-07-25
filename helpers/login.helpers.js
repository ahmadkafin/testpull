const axios = require('axios');

const post = async (url, payload) => {
    try {
        let res = '';
        const response = await axios.post(url, payload);
        res = response;
        return res;
    } catch (error) {
        return error;
    }
}

exports.token = async () => {
    let token = await post('http://10.129.10.138/digio2021/digiohandlers/TokenAuth.ashx', {
        username: 'ahmad.kafin-e',
        password: 'Sup3rm4n1702!@!@',
        dir: 'pgn',
    });
    return token.data.accessToken;
}