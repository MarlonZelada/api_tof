import mysql from 'mysql';
require('dotenv').config();

const mysqlConection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    multipleStatements: true
})

mysqlConection.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('DB is connected');
    }
})

export default mysqlConection;