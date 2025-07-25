const db = require('../configs/db.configs');

let pageData = async () => {
    try {
        let data = await db.pgnQuery(`SELECT * FROM APP_PGN.pgn.digio_menu WHERE url LIKE '%.aspx%'`);
        return data.recordset;
    } catch (error) {
        return error;
    }
}

let serviceData = async () => {
    try {
        let data = await db.windiGetQuery(`SELECT * FROM APP_WINDI.pgn.windi_service_map WHERE isEnable = 1`);
        return data.recordset;
    } catch (error) {
        return error;
    }
}

let cctvData = async () => {
    try {
        let data = await db.windiGetQuery(`SELECT * FROM APP_WINDI.pgn.windi_cctv`);
        return data.recordset;
    } catch (error) {
        return error;
    }
}

let createPage = async (data, i) => {
    try {
        await db.windiQuery(`INSERT INTO APP_WINDI.pgn.report_page(uid_global, uid, url, status) VALUES('${data[i].uidGlobal}', '${data[i].uid}', '${data[i].url}', ${data[i].status})`);
    } catch (error) {
        return error;
    }
}

let createServer = async (data, i) => {
    try {
        await db.windiQuery(`INSERT INTO APP_WINDI.pgn.report_server(uid_global, uid, ip_server, status) VALUES('${data[i].uidGlobal}', '${data[i].uid}', '${data[i].url}', '${data[i].status}')`);
    } catch (error) {
        return error;
    }
}

let createService = async (data, i) => {
    try {
        await db.windiQuery(`INSERT INTO APP_WINDI.pgn.report_map_service(uid_global, uid, url, status) VALUES('${data[i].uidGlobal}', '${data[i].uid}', '${data[i].url}', ${data[i].status})`);
    } catch (error) {
        return error;
    }
}

let createCctv = async (data, i) => {
    try {
        await db.windiQuery(`INSERT INTO APP_WINDI.pgn.report_cctv(uid_global, uid, url, status) VALUES('${data[i].uidGlobal}', '${data[i].uid}', '${data[i].url}', ${data[i].status})`);
    } catch (error) {
        return error;
    }
}

module.exports = { pageData, serviceData, cctvData, createPage, createServer, createService, createCctv }