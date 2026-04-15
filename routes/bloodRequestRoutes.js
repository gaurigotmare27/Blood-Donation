const express = require('express');
const { getActiveRequests, createRequest } = require('../controllers/bloodRequestController');
const router = express.Router();

router.get('/active', getActiveRequests);
router.post('/', createRequest);

module.exports = router;
