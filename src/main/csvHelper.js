const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const { isAfter, isBefore, isEqual } = require('date-fns');

const CSV_FILEPATH = '/home/benblock/Documents/Budget/transactions_2020.csv';
exports.CSV_FILEPATH = CSV_FILEPATH;

const csvHeader = [
  { id: 'date', title: 'date' },
  { id: 'type', title: 'type' },
  { id: 'description', title: 'description' },
  { id: 'category', title: 'category' },
  { id: 'source', title: 'source' },
  { id: 'beneficiary', title: 'beneficiary' },
  { id: 'amount', title: 'amount' },
];

function getAllRows() {
  const stream = fs.createReadStream(CSV_FILEPATH).pipe(csvParser());
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

exports.addRow = (row) => {
  return new Promise(async (resolve, reject) => {
    const csvWriterAppend = createCsvWriter({
      path: CSV_FILEPATH,
      header: csvHeader,
      append: true,
    });
    await csvWriterAppend.writeRecords([row]);
    const rows = await getAllRows();
    // Sort if original rows are in descending order
    // const sortedRows = rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    const csvWriter = createCsvWriter({
      path: CSV_FILEPATH,
      header: csvHeader,
    });
    csvWriter.writeRecords(rows).then(() => resolve());
  });
};
