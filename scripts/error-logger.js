const {app} = require('electron');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const dateFormat = require('dateformat');
const endOfLine = require('os').EOL;

// Writes specified message to the error log
this.logError = function (message) {
  let errorLog = `${app.getPath('userData')}/error.log`;
  let now = dateFormat(new Date(), 'mm/dd/yyyy hh:MM:ss TT');
  let logEntry = `${now}: ${message}${endOfLine}`;
  
  return fs.statAsync(errorLog).then(function (stats) {
    // Delete log every 30 days so that it doesn't build up
    let daysOld = dateDiffInDays(stats.birthtime, new Date());
    if (daysOld > 30) {
      return fs.unlinkAsync(errorLog);
    }
  }).then(function () {
    // Append by default, if file doesn't exist it will be created
    return fs.appendFile(errorLog, logEntry);
  }).catch(function (err) {
    // Handle file not exists error by writing to a new file
    if (err.code === 'ENOENT') {
      return fs.writeFile(errorLog, logEntry);
    } else {
      throw err;
    }
  });
};

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information
  let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / (1000*60*60*24));
}

module.exports = this;