const supabase = require('../config/database');

class User {
    static async create(userData, callback) {
        const { email, password, full_name, blood_type, city, avatar_url } = userData;
        
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([
                    { email, password, full_name, blood_type, city, avatar_url }
                ])
                .select();
                
            if (error) throw error;
            callback(null, data ? data[0] : null);
        } catch (error) {
            console.error('Supabase Error (User.create):', error);
            callback(error, null);
        }
    }

    static async findByEmail(email, callback) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
                
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
            callback(null, data);
        } catch (error) {
            console.error('Supabase Error (User.findByEmail):', error);
            callback(error, null);
        }
    }

    static async getById(id, callback) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();
                
            if (error) throw error;
            callback(null, data);
        } catch (error) {
            console.error('Supabase Error (User.getById):', error);
            callback(error, null);
        }
    }
}

module.exports = User;
