const pool = require('./libraries/dbconnection');
const readline = require('readline');
const fs = require('fs');

// Функция для обработки каждой строки из файла
async function processLineByLine(filePath) {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const wallet = line.trim();
        if (wallet) {
            try {
                const sql = 'DELETE FROM userstatistics WHERE UserAddress = ?';
                const [result] = await pool.execute(sql, [wallet]);
                console.log(`Кошелек ${wallet}: успешно удалено строк: ${result.affectedRows}`);
            } catch (error) {
                console.error(`Ошибка удаления кошелька ${wallet}:`, error);
            }
        }
    }

    console.log('Обработка файла завершена.');
}

// Запуск функции
processLineByLine('wallets.txt').catch(error => console.error('Ошибка:', error));
