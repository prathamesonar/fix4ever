const express = require('express');
const router = express.Router();
const {
    getAvailableTechnicians,
    getTechnicianProfile,
} = require('../controllers/technicianController');
const { protect } = require('../middleware/authMiddleware');

router.get('/available', protect, getAvailableTechnicians);

router.get('/:id/profile', protect, getTechnicianProfile);

module.exports = router;