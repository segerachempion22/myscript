const fs = require('fs');
const async = require('async');
const { count } = require('console');
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
function arrayssravn(arr1, arr2) {
    let count = 0;
    for (let i = 0; i < 3; i++) {
        if (arr1[i] === arr2[i]) {
            count += 1;
        }
    }
    if (count === 3) {
        return true;
    } else {
        return false;
    }
}

async function countUniqueElements(arr1, arr2) {
    const combinedArray = [...arr1, ...arr2];
    const elementCount = {};
    for (let i = 0; i < combinedArray.length; i++) {
        let count = 0;
        for (let k = 0; k < combinedArray.length; k++) {
            if (arrayssravn(combinedArray[i], combinedArray[k])) {
                count += 1;
            }
        }
        elementCount[JSON.stringify(combinedArray[i])] = count;
    }

    let uniqueCount = 0;
    for (const key in elementCount) {
        if (elementCount[key] === 1) {
            uniqueCount++;
        }
    }
    return Math.ceil(uniqueCount);
}
function checkTransactionForAddress(transaction, address) {
    const columns = transaction.split(',');
    if (columns[4] === address) {
        const date = new Date(columns[5] + columns[6]);
        const timestamp = date.getTime();
        return [columns[0], columns[2], columns[7],timestamp / 1000];
    }
    return null;
}
async function calculateSimilarity(arr1, arr2) {
    const count = await countUniqueElements(arr1,arr2)
    return 1 - (count / (arr1.length + arr2.length));
}
/*function calculateSimilarity(arr1, arr2) {
    count = 0;
    for (let i = 0; i < Math.min(arr1.length, arr2.length);i++){
        if(arr1[i] == arr2[i]){
            count+=1;
        }
    }
    return count / Math.min(arr1.length, arr2.length);
}
function calculateSimilarity(arr1, arr2) {
    const intersection = arr1.filter(element1 => {
        return arr2.some(element2 => JSON.stringify(element1) === JSON.stringify(element2));
    });
    const similarity = intersection.length / Math.min(arr1.length, arr2.length);
    return similarity;
}*/

const similarAddressesMap = {};
const similarAddressesMap2 = {};
const processedAddresses = [];
const csvFilePath = 'data.csv';

const walletsarray = readLinesSync('wallets.txt');

fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Ошибка при чтении файла CSV: ${err.message}`);
        return;
    }
    async function compareAddresses(address1, address2,) {
        similarAddressesMap[address1].sort((a, b) => {
            return a[3] - b[3];
        });
        similarAddressesMap[address2].sort((a, b) => {
            return a[3] - b[3];
        });
        if (address1 !== address2  && !similarAddressesMap2[address1].includes(address2) && !processedAddresses.includes[address1]) {
            const similarity = await calculateSimilarity(similarAddressesMap[address1], similarAddressesMap[address2]);
            if (similarity >= 1) {
               // console.log(similarAddressesMap[address1], similarAddressesMap[address2]);
                similarAddressesMap2[address1].push(address2);
                console.log("Похожие адреса:", address1, address2);
                processedAddresses.push(address2);
            }
        }
    }
    async.eachLimit(walletsarray, 20, (address, callback) => {
        similarAddressesMap[address] = [];
        similarAddressesMap2[address] = [];
        console.log("Проверяем адрес:", address);
        fs.readFile(csvFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Ошибка при чтении файла CSV: ${err.message}`);
                callback(err);
                return;
            }

            const transactions = data.split('\n');
            for (const transaction of transactions) {
                const columns = checkTransactionForAddress(transaction, address);
                if (columns) {
                    similarAddressesMap[address].push(columns);
                }
            }

            callback();
        });
    }, err => {
        if (err) {
            console.error(`Ошибка при проверке адресов: ${err.message}`);
            return;
        }

        (async () => {
            for (const address1 of walletsarray) {
                for (const address2 of walletsarray) {
                    if (!processedAddresses.includes(address2) && !processedAddresses.includes(address1)) {
                        await compareAddresses(address1, address2);
                    } else {
                        continue;
                    }
                }
                processedAddresses.push(address1);
            }
            
            for (const key in similarAddressesMap2) {
                if (Array.isArray(similarAddressesMap2[key]) && similarAddressesMap2[key].length === 0) {
                    delete similarAddressesMap2[key];
                } else {
                    let tempobject = { syblis: [] };
                    if(similarAddressesMap2[key].length > 5){
                        if (key in similarAddressesMap) {
                            tempobject.syblis.push({ [key]: similarAddressesMap[key] });
                        }
                        for (const key2 in similarAddressesMap2[key]) {
                            tempobject.syblis.push({ [similarAddressesMap2[key][key2]]: similarAddressesMap[similarAddressesMap2[key][key2]] });
                        }
                        fs.writeFile(`(${similarAddressesMap2[key].length + 1} wallets data).json`, JSON.stringify(tempobject), err => {
                            if (err) {
                                console.error(`Ошибка при записи файла: ${err.message}`);
                                return;
                            }
                            console.log(`Адреса успешно записаны в файл${key}.json`);
                        });
                        const tempobject2 = similarAddressesMap2[key];
                        tempobject2.push(key)
                        fs.writeFile(`(${similarAddressesMap2[key].length} wallets list).json`, JSON.stringify(tempobject2), err => {
                            if (err) {
                                console.error(`Ошибка при записи файла: ${err.message}`);
                                return;
                            }
                            console.log('Адреса успешно записаны в файл dump.json');
                        }); 
                    }
                    
                }
            }
            
            /*fs.writeFile('dump.json', JSON.stringify(similarAddressesMap2), err => {
                if (err) {
                    console.error(`Ошибка при записи файла: ${err.message}`);
                    return;
                }
                console.log('Адреса успешно записаны в файл dump.json');
            }); */
        })();
        
    });
});