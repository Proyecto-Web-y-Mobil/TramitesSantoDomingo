const mysql = require('mysql2/promise');
require('dotenv').config();

console.log("=== DIAGNÓSTICO DE BASE DE DATOS ===");
console.log("Host leído:", process.env.MYSQLHOST);
console.log("Puerto leído:", process.env.MYSQLPORT);
console.log("====================================");

const pool = mysql.createPool({
  host:     process.env.MYSQLHOST,
  port:     process.env.MYSQLPORT,
  user:     process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

module.exports = pool;
