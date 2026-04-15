const db = require('../config/database');

class BloodRequest {
    static create(requestData, callback) {
        const { patient_name, required_blood_type, hospital_name, urgency_level } = requestData;
        
        const is_fulfilled = 0; // Default boolean as 0 for integer storage in sqlite
        const query = `INSERT INTO blood_requests (patient_name, required_blood_type, hospital_name, urgency_level, is_fulfilled) VALUES (?, ?, ?, ?, ?)`;
        
        db.run(query, [patient_name, required_blood_type, hospital_name, urgency_level, is_fulfilled], function(err) {
            callback(err, this ? this.lastID : null);
        });
    }

    static getActive(callback) {
        // SQLite stores boolean as 0 or 1
        const query = `SELECT * FROM blood_requests WHERE is_fulfilled = 0`;
        db.all(query, [], (err, rows) => {
            if (rows) {
                // Convert integer 0/1 back to boolean for JSON API response
                rows.forEach(row => {
                    row.is_fulfilled = row.is_fulfilled === 1;
                });
            }
            callback(err, rows);
        });
    }
}

module.exports = BloodRequest;
