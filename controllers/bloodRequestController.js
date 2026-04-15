const BloodRequest = require('../models/BloodRequest');

const getActiveRequests = (req, res) => {
    BloodRequest.getActive((err, requests) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while fetching active requests.' });
        }
        res.status(200).json(requests);
    });
};

const createRequest = (req, res) => {
    const { patient_name, required_blood_type, hospital_name, urgency_level } = req.body;
    
    if (!patient_name || !required_blood_type || !hospital_name || !urgency_level) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    if (urgency_level < 1 || urgency_level > 5) {
         return res.status(400).json({ error: 'Urgency level must be between 1 and 5.' });
    }

    BloodRequest.create(req.body, (err, insertId) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while creating blood request.' });
        }
        res.status(201).json({ message: 'Blood request created successfully.', id: insertId });
    });
};

module.exports = {
    getActiveRequests,
    createRequest
};
