const fs = require('fs');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.levels = ['debug', 'info', 'warn', 'error'];
    this.logLevel = options.logLevel || 'debug';
    this.logToFile = options.logToFile || false;
    this.logFilePath = options.logFilePath || path.join(__dirname, 'bot.log');
  }


  shouldLog(level) {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.logLevel);
  }

  formatDate() {
    return new Date().toISOString();
  }

  writeToFile(message) {
    if (!this.logToFile) return;
    fs.appendFile(this.logFilePath, message + '\n', err => {
      if (err) console.error('Failed to write log to file:', err);
    });
  }

  debug(message) {
    if (!this.shouldLog('debug')) return;
    const logMessage = `\x1b[36m[DEBUG]\x1b[0m ${this.formatDate()} - ${message}`;
    console.debug(logMessage);
    this.writeToFile(`[DEBUG] ${this.formatDate()} - ${message}`);
  }

  info(message) {
    if (!this.shouldLog('info')) return;
    const logMessage = `\x1b[34m[INFO]\x1b[0m ${this.formatDate()} - ${message}`;
    console.log(logMessage);
    this.writeToFile(`[INFO] ${this.formatDate()} - ${message}`);
  }

  warn(message) {
    if (!this.shouldLog('warn')) return;
    const logMessage = `\x1b[33m[WARN]\x1b[0m ${this.formatDate()} - ${message}`;
    console.warn(logMessage);
    this.writeToFile(`[WARN] ${this.formatDate()} - ${message}`);
  }

  error(message) {
    if (!this.shouldLog('error')) return;
    const logMessage = `\x1b[31m[ERROR]\x1b[0m ${this.formatDate()} - ${message}`;
    console.error(logMessage);
    this.writeToFile(`[ERROR] ${this.formatDate()} - ${message}`);
  }
}

module.exports = Logger;
