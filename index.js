const fs = require('fs');
const pool = require('./libraries/dbconnection');

function readLinesSync(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n').map(line => line.trim()).filter(line => line);
    return lines;
  } catch (error) {
    console.error(`Ошибка при чтении файла: ${error.message}`);
    return [];
  }
}

function objectToCsvRow(obj) {
  const values = Object.values(obj);
  const csvRow = values.map(value => {
    if (value === null || value === undefined) {
      return '';
    } else if (typeof value === 'string' && value.includes(',')) {
      return `"${value}"`;
    } else {
      return value;
    }
  }).join(',');
  return csvRow;
}
function objectsToCsv(objects) {
  const csvRows = objects.map(objectToCsvRow);
  return csvRows.join('\n');
}
async function executeQuery() {
  const lines = readLinesSync(filePath);
  if (lines.length > 0) {
    const formattedValues = lines.map(line => `'${line}'`).join(', ');
    const sqlQuery = `SELECT * FROM transactions2 WHERE SENDER_WALLET IN (${formattedValues})`;
    try {
      console.log("делаем запрос")
      const [results] = await pool.query(sqlQuery);
      return results;
    } catch (error) {
      console.error(`Ошибка при выполнении запроса: ${error.message}`);
    }
  } else {
    console.log('Файл пуст или произошла ошибка при его чтении.');
  }
}

async function main() {
  const recieved_data = await executeQuery();
  console.log("получили данные, теперь обрабатываем их");
  const csvData = objectsToCsv(recieved_data);

  const filePath2 = 'data.csv';
  fs.writeFileSync(filePath2, csvData, { encoding: 'utf8' });
  console.log(`Данные успешно записаны в файл: ${filePath2}`);
}

const filePath = 'wallets.txt';

main();
