const fs = require('fs');
const path = require('path');
const { format: formatDate } = require('date-fns');
require('dotenv').config();

const LOGS_DIR = process.env.LOGS_DIR || './logs';
const ERROR_LOG_FILE = process.env.ERROR_LOG_FILE || 'errors.log';
const ACTIVITY_LOG_FILE = process.env.ACTIVITY_LOG_FILE || 'activity.php';

if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const appendToLogFile = (fileName, message) => {
    const filePath = path.join(LOGS_DIR, fileName);
    fs.appendFile(filePath, message + '\n', (err) => {
        if (err) {
            console.error(`Failed to write to log file: ${err}`);
        }
    });
};

const formatLogMessage = (message) => `[${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')}]: ${message}`;

const logActivity = (message) => {
    const formattedMessage = formatLogMessage(message);
    console.log(formattedMessage);
    appendToLogFile(ACTIVITY_LOG_FILE, formattedMessage);
};

const logError = (error) => {
    const formattedMessage = formatLogMessage(`ERROR: ${error.message}`);
    console.error(formattedMessage);
    appendToLogFile(ERROR_LOG_FILE, formattedMessage);
};

module.exports = {
    logActivity,
    logError,
};