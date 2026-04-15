const Donor = require('../models/Donor');

const createDonor = (req, res) => {
    const { name, blood_type, contact, city } = req.body;
    
    if (!name || !blood_type || !contact || !city) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    Donor.create(req.body, (err, insertId) => {
        if (err) {
            if (err.message === 'Invalid blood type') {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'Database error while creating donor.' });
        }
        res.status(201).json({ message: 'Donor created successfully.', id: insertId });
    });
};

const getAllDonors = (req, res) => {
    Donor.getAll((err, donors) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while fetching donors.' });
        }
        res.status(200).json(donors);
    });
};

module.exports = {
    createDonor,
    getAllDonors
};
