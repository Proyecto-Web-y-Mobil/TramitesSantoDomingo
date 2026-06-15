const mysql = require('mysql2/promise');
require('dotenv').config();

console.log("=== DIAGNÓSTICO DE BASE DE DATOS ===");
console.log("Host leído:", process.env.MYSQLHOST || process.env.DB_HOST || 'db');
console.log("Puerto leído:", process.env.MYSQLPORT || process.env.DB_PORT || 3306);
console.log("====================================");

const pool = mysql.createPool({
  // Busca la variable de Railway, luego la de Docker, y por último el contenedor 'db'
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'db',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'user_admin',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'user_password',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'tramites_db',
});

module.exports = pool;