import mysql from 'mysql';

const mysqlConection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: 'todogar',
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