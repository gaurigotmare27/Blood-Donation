const supabase = require('../config/database');

class BloodRequest {
    static async create(requestData, callback) {
        const { patient_name, required_blood_type, hospital_name, urgency_level } = requestData;
        
        try {
            const { data, error } = await supabase
                .from('blood_requests')
                .insert([
                    { patient_name, required_blood_type, hospital_name, urgency_level, is_fulfilled: false }
                ])
                .select();
                
            if (error) throw error;
            callback(null, data ? data[0].id : null);
        } catch (error) {
            console.error('Supabase Error (BloodRequest.create):', error);
            callback(error, null);
        }
    }

    static async getActive(callback) {
        try {
            const { data, error } = await supabase
                .from('blood_requests')
                .select('*')
                .eq('is_fulfilled', false);
                
            if (error) throw error;
            callback(null, data);
        } catch (error) {
            console.error('Supabase Error (BloodRequest.getActive):', error);
            callback(error, null);
        }
    }
}

module.exports = BloodRequest;
