const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'T3m1t0p3#%#$',
});

module.exports = pool.promise();