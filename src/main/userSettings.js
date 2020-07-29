const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class UserSettings {
  constructor() {
    this._filePath = path.join(app.getPath('userData'), 'settings.json');
  }

  get instance() {
    if (!this._instance) {
      this._instance = new UserSettings();
    }
    return this._instance;
  }

  // TEMP
  csvFilePath() {
    return '/home/benblock/Documents/Budget/transactions_2020.csv';
  }

  get() {
    if (!fs.existsSync(this._filePath)) {
      fs.writeFileSync(this._filePath, JSON.stringify({}));
      return {};
    } else {
      return new Promise((resolve, reject) => {
        fs.readFile(this._filePath, (err, data) => {
          if (err) reject(err);
          resolve(JSON.parse(data));
        });
      });
    }
  }

  set(key, value) {
    fs.writeFile(
      this._filePath,
      JSON.stringify({
        [key]: value,
      }),
      (err) => {
        if (err) throw err;
      },
    );
  }
}

module.exports = new UserSettings();
