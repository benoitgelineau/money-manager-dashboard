const csvParser = require('csv-parser');
const fs = require('fs');

module.exports = {
  getAllRows: (filepath) => {
    const stream = fs.createReadStream(filepath).pipe(
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
  },
};
