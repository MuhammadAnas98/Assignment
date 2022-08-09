const mysql = require('mysql');

const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: "sys"
});

const runMysql = () => {
    dbConnection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Server!');
    });
}

module.exports = {
    runMysql,
    dbConnection,
};