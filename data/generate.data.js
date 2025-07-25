const axios = require('axios');
const ping = require('ping');
const iptv = require('iptv-checker-module');

const _sql = require('../sql/query.sql');
const token = require('../helpers/login.helpers');
const { v4: uuidv4 } = require('uuid');
const uidGlobal = uuidv4();

exports.pageData = async (url) => {
    try {
        let arrPage = [];
        let msgRes = [];
        let pages = await _sql.pageData();
        let tkn = await token.token();
        for (let page of pages) {
            let urls = page.url.includes('?') ? `${url}${page.url}&token=${tkn}` : `${url}${page.url}?token=${tkn}`;
            await axios.get(urls, { timeout: 500 }).then(response => {
                let finalUrl = response.config.url;
                finalUrl = finalUrl.substring(0, finalUrl.indexOf('token='));
                if (response.data.hasOwnProperty('error')) {
                    arrPage.push({
                        uidGlobal: uidGlobal,
                        uuid: uuidv4(),
                        fullUrl: urls,
                        url: finalUrl,
                        status: response.data.hasOwnProperty('error') ? response.data.error.code : response.status,
                    });
                    msgRes.push(`-> ${finalUrl}, status : ${response.data.hasOwnProperty('error') ? response.data.error.code : response.status}, pesan : ${response.data.hasOwnProperty('error') ? response.data.error.message : 'up'}`);
                }
                return { arrPage, msgRes };
            }).catch(error => {
                let finalUrl = urls;
                finalUrl = finalUrl.substring(0, finalUrl.indexOf('token='));
                arrPage.push({
                    uidGlobal: uidGlobal,
                    uuid: uuidv4(),
                    fullUrl: urls,
                    url: finalUrl,
                    status: 408,
                });
                msgRes.push(`-> ${finalUrl}, status : 408, pesan : connection timed out`);
                return { arrPage, msgRes }
            });
        }
        return { arrPage, msgRes };
    } catch (error) {
        return error;
    }
}

exports.serverData = async () => {
    let servers = [
        '10.129.18.150',
        '10.129.18.153',
        '10.129.18.154',
        '10.129.18.155',
        '10.129.18.159',
        '10.129.18.45',
        '10.129.18.46',
        '10.129.18.47',
        '10.129.18.48',
        '10.129.18.49',
        '10.129.18.203',
        '10.129.10.131',
        '10.129.10.132',
        '10.129.10.133',
        '10.129.10.134',
        '10.129.10.135',
        '10.129.10.136',
        '10.129.10.137',
        '10.129.10.138',
        '10.129.10.139',
        '10.129.10.140',
    ];
    let arrServer = [];
    let msgRes = [];
    try {
        for (let server of servers) {
            let res = await ping.promise.probe(server, {
                timeout: 30,
            });
            if (server == '10.129.18.155') {
                arrServer.push({
                    uidGlobal: uidGlobal,
                    uid: uuidv4(),
                    ip: server,
                    status: 'disabled'
                });
                msgRes.push(`-> ${server} is disabled`);
            } else if (server == '10.129.18.159') {
                arrServer.push({
                    uidGlobal: uidGlobal,
                    uid: uuidv4(),
                    ip: server,
                    status: 'disabled'
                });
                msgRes.push(`-> ${server} is disabled`)
            } else {
                arrServer.push({
                    uidGlobal: uidGlobal,
                    uid: uuidv4(),
                    ip: server,
                    status: res.alive ? 'up' : 'down'
                });
                msgRes.push(`-> ${server} is ${res.alive ? 'up' : 'down'}`)
            }
        }
        return { arrServer, msgRes };
    } catch (error) {
        return error;
    }
}

exports.serviceData = async () => {
    let arrService = [];
    let msgRes = [];
    try {
        let services = await _sql.serviceData();
        for (let service of services) {
            let urls = service.url.includes('?') ? `${service.url}&f=pjson` : `${service.url}?f=pjson`;
            await axios.get(urls, { timeout: 500 }).then(response => {
                if (response.data.hasOwnProperty('error')) {
                    arrService.push({
                        uidGlobal: uidGlobal,
                        uid: uuidv4(),
                        url: service.url,
                        status: response.data.hasOwnProperty('error') ? response.data.error.code : 200,
                        isEnable: service.isEnable,
                    });
                    msgRes.push(`-> ${service.url} is ${response.data.hasOwnProperty('error') ? response.data.error.code : 200} ${response.data.hasOwnProperty('error') ? response.data.error.message : 'up'}`)
                }
                return { arrService, msgRes };
            }).catch(error => {
                arrService.push({
                    uidGlobal: uidGlobal,
                    uid: uuidv4(),
                    url: service.url,
                    status: 408,
                    isEnable: service.isEnable,
                });
                msgRes.push(`-> ${service.url} is 408 connection timed out`)
                return { arrService, msgRes };
            })
        }
        return { arrService, msgRes }
    } catch (error) {
        return error;
    }
}

exports.cctvData = async () => {
    let arrCctv = [];
    let msgRes = [];
    try {
        let cctvs = await _sql.cctvData();
        for (let cctv of cctvs) {
            const opts = {
                timeout: 5000,
                parallel: 2,
            }
            await iptv(cctv.url, opts).then(res => {
                // arrCctv.push({
                //     uidGlobal: uidGlobal,
                //     uid: uuidv4(),
                //     url: cctv.url,
                //     status: 200,
                // })
                // msgRes.push(`-> ${cctv.url} is up with status code 200`);
                // return { arrCctv, msgRes }
                // return null;
            }).catch(err => {
                arrCctv.push({
                    uidGlobal: uidGlobal,
                    uid: uuidv4(),
                    url: cctv.url,
                    status: err.message == 'Not Found' ? 404 : 500,
                });
                msgRes.push(`-> ${cctv.url} is down with status code ${err.message == 'Not Found' ? 404 : 500}`)
                return { arrCctv, msgRes }
            });
        }
        return { arrCctv, msgRes };
    } catch (error) {
        return error;
    }
}

