const _sql = require('../sql/query.sql');
const _data = require('../data/generate.data');

exports.inputToTablePageReport = async (url) => {
    try {
        let data = await _data.pageData(url);
        for (let i in data.arrPage) {
            await _sql.createPage(data.arrPage, i);
            console.log(`Page ${data.arrPage[i].url} has automatically checked`);
        }
        return true;
    } catch (error) {
        return error;
    }
}

exports.inputToTableServerReport = async () => {
    try {
        let data = await _data.serverData();
        for (let i in data.arrServer) {
            await _sql.createServer(data.arrServer, i);
            console.log(`Server ${data.arrServer[i].ip} has automatically checked`);
        }
        return true;
    } catch (error) {
        return error;
    }
}

exports.inputToTableServiceReport = async () => {
    try {
        let data = await _data.serviceData();
        for (let i in data.arrService) {
            await _sql.createService(data.arrService, i);
            console.log(`Service ${data.arrService[i].url} has automatically checked`);
        }
        return true;
    } catch (error) {
        return error;
    }
}

exports.inputToTableCctvReport = async () => {
    try {
        let data = await _data.cctvData();
        for (let i in data.arrCctv) {
            await _sql.createCctv(data.arrCctv, i);
            console.log(`CCTV ${data.arrCctv[i].url} has automatically checked`);
        }
        return true;
    } catch (error) {
        return error;
    }
}