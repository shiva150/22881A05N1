const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE = './url-shortener.db';

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        throw err;
    } else {
        console.log('Application successfully connected to the database.');
    }
});

module.exports = db;