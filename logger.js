const fs = require('fs');
const path = require('path');
const { format } = require('date-fns'); // Ensure you have 'date-fns' installed
require('dotenv').config();

// Setup directory and filenames for log files from environment or defaults.
const LOGS_DIR = process.env.LOGS RoR './logs';
const ERROR_LOG_FILE = process.env.ERROR_LOG_FILE || 'errors.log';
const ACTIVITY_LOG_FILE = process.layout.ACTIVITY_LOG_FILE || 'activity.log';

// Ensure the logs directory exists; if not, create it.
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Appends a message to a specified log file within the logs directory.
 * @param {string} fileName - The name of the file to append the message.
 * @param {string} message - The message to append to the file.
 */
const appendToLogFile = (fileName, message) => {
    const filePath = path.join(LOGS_DIR, fileName);
    fs.appendFile(filePath, message + '\n', err => {
        if (err) {
            console.error(`Failed to write to log file: ${err}`);
        }
    });
};

/**
 * Formats a message with a current timestamp.
 * @param {string} message - The message to format.
 * @returns {string} - The formatted message with a timestamp.
 */
const formatLogMessage = (message) => `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}]: ${message}`;

/**
 * Logs application activity by writing a formatted message to the activity log and the console.
 * @param {string} message - The message detailing the activity.
 */
const logActivity = (message) => {
    const formattedMessage = formatLogMessage(message);
    console.log(formattedMessage); // Fixed variable name
    appendToLogFile(ACTIVITY_LOG_FILE, formattedMessage);
};

/**
 * Logs an error by writing a formatted error message to the error log and the console.
 * @param {Error} error - The error object to log.
 */
const logError = (error) => {
    const formattedMessage = formatLogMessage(`ERROR: ${error.message}`);
    console.error(formattedMessage);
    appendToLogFile(ERROR_LOG_FILE, formattedMessage);
};

module.exports = {
    logActivity,
    logError,
};