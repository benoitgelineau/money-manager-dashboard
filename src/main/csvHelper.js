const csvParser = require('csv-parser');
const fs = require('fs');
const { isAfter, isBefore, isEqual } = require('date-fns');

const CSV_FILEPATH = '/home/benblock/Documents/Budget/transactions_2020.csv';
exports.CSV_FILEPATH = CSV_FILEPATH;

function getAllRows() {
  const stream = fs.createReadStream(CSV_FILEPATH).pipe(
    csvParser({
      quote: "'",
    }),
  );
  return new Promise((resolve, reject) => {
    const results = [];
    stream.on('data', (data) => results.push(data));
    stream.on('end', () => resolve(results));
    stream.on('error', (error) => reject(error));
  });
}

exports.getRows = async ({ from = null, to = Date.now() } = {}) => {
  const rows = await getAllRows();
  return rows.filter(({ date }) => {
    const currentDate = new Date(date);
    return (isEqual(currentDate, to) || isBefore(currentDate, to)) && from
      ? isEqual(currentDate, from) || isAfter(currentDate, from)
      : true;
  });
};
