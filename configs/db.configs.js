const sql = require('mssql');

const windiConfig = {
    user: 'pgn',
    password: 'p@$$w0rdnya2011+',
    database: 'APP_WINDI',
    server: '10.129.10.142',
    pool: {
        max: 10,
        min: 0
    },
    options: {
        encrypt: false,
        trustServerCertificate: false,
    }
}

const pgnConfig = {
    user: 'pgn',
    password: 'p@$$w0rdnya2011+',
    database: 'APP_PGN',
    server: '10.129.10.142',
    pool: {
        max: 10,
        min: 0,
    },
    options: {
        encrypt: false,
        trustServerCertificate: false,
    }
}

const windiGetQuery = async (queryString) => {
    try {
        await sql.connect(windiConfig);
        const result = sql.query(queryString).then(result => {
            return result;
        });
        return result;
    } catch (error) {
        return error;
    }
}

const pgnQuery = async (queryString) => {
    try {
        await sql.connect(pgnConfig);
        const result = sql.query(queryString).then(result => {
            return result;
        })
        return result;
    } catch (error) {
        return error;
    }
}

const windiQuery = async (queryString) => {
    try {
        await sql.connect(windiConfig);
        const request = new sql.Request();
        request.query(queryString).then(result => {
            return result;
        })
    } catch (error) {
        return error;
    }
}

module.exports = { windiGetQuery, pgnQuery, windiQuery }