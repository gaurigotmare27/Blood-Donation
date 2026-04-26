const express = require('express');
const cors = require('cors');
const path = require('path');

const donorRoutes = require('./routes/donorRoutes');
const bloodRequestRoutes = require('./routes/bloodRequestRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/donors', donorRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/users', userRoutes);

// Test Route to verify backend is alive
app.get('/api/health', (req, res) => res.json({ status: 'Backend is running!' }));

// Serve Static Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Fallback logic
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
