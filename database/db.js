const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbSsl = process.env.DB_SSL;
const dbPort = process.env.DB_PORT;

const connection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  port: dbPort,
  password: dbPassword,
  database: dbName,
  ssl: {
    ca: fs.readFileSync(dbSsl)
  }
});


connection.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

connection.query('USE testing', (err) => {
  if (err) {
    console.error('Error al seleccionar la base de datos:', err);
    return;
  } else {
    console.log('Base de datos seleccionada');

  }
})



module.exports = connection;