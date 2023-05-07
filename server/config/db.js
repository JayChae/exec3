
const mysql = require('mysql');

const db = mysql.createPool({
    host:"database-1.cnqpoq9t72di.ap-northeast-2.rds.amazonaws.com",
    user:"admin",
    password:"jay8582$",
    database:"exec2"

});

module.exports = db;