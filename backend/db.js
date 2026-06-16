const mysql = require('mysql2/promise');
require('dotenv').config();

console.log("=== DIAGNÓSTICO DE BASE DE DATOS ===");
console.log("Host leído:", process.env.MYSQLHOST || process.env.DB_HOST || 'db');
console.log("Puerto leído:", process.env.MYSQLPORT || process.env.DB_PORT || 3306);
console.log("====================================");

const pool = mysql.createPool({
  host: 'db', // Fuerza el nombre del servicio en docker-compose
  port: 3306,
  user: 'user_admin', 
  password: 'user_password',
  database: 'tramites_db',
});

module.exports = pool;