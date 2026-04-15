const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../blood_donation.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDB();
    }
});

function initializeDB() {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS donors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                blood_type TEXT NOT NULL,
                contact TEXT NOT NULL,
                city TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS blood_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_name TEXT NOT NULL,
                required_blood_type TEXT NOT NULL,
                hospital_name TEXT NOT NULL,
                urgency_level INTEGER CHECK(urgency_level BETWEEN 1 AND 5),
                is_fulfilled BOOLEAN DEFAULT 0
            )
        `);
    });
}

module.exports = db;
