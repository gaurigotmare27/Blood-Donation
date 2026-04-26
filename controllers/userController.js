const User = require('../models/User');

exports.register = (req, res) => {
    console.log('--- NEW REGISTRATION REQUEST ---');
    console.log('Data received:', req.body);
    User.create(req.body, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(user);
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json(user);
    });
};

exports.getProfile = (req, res) => {
    const userId = req.params.id;
    User.getById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
};
