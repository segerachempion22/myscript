const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Устанавливаем путь к файлу .env в переменной окружения DOTENV_CONFIG_PATH
dotenv.config({ path: path.resolve(__dirname, 'keys.env') });

console.log(process.env.databaseHost, process.env.databaseUser, process.env.databasePassword, process.env.databaseDatabaseName);

const pool = mysql.createPool({
    host: process.env.databaseHost,
    user: process.env.databaseUser,
    password: process.env.databasePassword,
    database: process.env.databaseDatabaseName,
    waitForConnections: true,
    connectionLimit: 1000,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных установлено');
});

module.exports = pool;
