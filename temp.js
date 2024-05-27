const dateString = "Fri Nov 17 2023 14:59:38 GMT+0300 (Москва, стандартное время)";

// Создание объекта Date из строки даты
const date = new Date(dateString);

// Получение Unix Timestamp
const timestamp = date.getTime();

console.log(timestamp);
