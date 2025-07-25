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
    let token = await post('super-secret-url', {
        username: 'super-secret-username',
        password: 'super-secret-password',
        dir: 'super-secret-dir',
    });
    return token.data.accessToken;
}
