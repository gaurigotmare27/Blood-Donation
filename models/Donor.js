const supabase = require('../config/database');

const VALID_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

class Donor {
    static validateBloodType(bloodType) {
        return VALID_BLOOD_TYPES.includes(bloodType);
    }

    static async create(donorData, callback) {
        const { name, blood_type, contact, city, age, weight, health_clearance } = donorData;
        
        if (!this.validateBloodType(blood_type)) {
            return callback(new Error('Invalid blood type'));
        }

        if (age < 18 || age > 65) return callback(new Error('Age must be between 18 and 65.'));
        if (weight < 50) return callback(new Error('Weight must be at least 50kg.'));
        if (!health_clearance) return callback(new Error('Must clear the health declaration.'));

        try {
            const { data, error } = await supabase
                .from('donors')
                .insert([
                    { name, blood_type, contact, city, age, weight, health_clearance }
                ])
                .select();
                
            if (error) throw error;
            callback(null, data ? data[0].id : null);
        } catch (error) {
            console.error('Supabase Error (Donor.create):', error);
            callback(error, null);
        }
    }

    static async getAll(callback) {
        try {
            const { data, error } = await supabase
                .from('donors')
                .select('*');
                
            if (error) throw error;
            callback(null, data);
        } catch (error) {
            console.error('Supabase Error (Donor.getAll):', error);
            callback(error, null);
        }
    }
}

module.exports = Donor;
