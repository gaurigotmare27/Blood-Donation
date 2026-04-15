const db = require('../config/database');

const VALID_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

class Donor {
    static validateBloodType(bloodType) {
        return VALID_BLOOD_TYPES.includes(bloodType);
    }

    static create(donorData, callback) {
        const { name, blood_type, contact, city } = donorData;
        
        if (!this.validateBloodType(blood_type)) {
            return callback(new Error('Invalid blood type'));
        }

        const query = `INSERT INTO donors (name, blood_type, contact, city) VALUES (?, ?, ?, ?)`;
        db.run(query, [name, blood_type, contact, city], function(err) {
            callback(err, this ? this.lastID : null);
        });
    }

    static getAll(callback) {
        const query = `SELECT * FROM donors`;
        db.all(query, [], (err, rows) => {
            callback(err, rows);
        });
    }
}

module.exports = Donor;
