const express = require('express');
const router = express.Router();
const {
    getDashboardStats, 
    getAllUsers,
    getAllRequests,
    deleteUserById,
    deleteRequestById,
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); 

router.get('/stats', protect, isAdmin, getDashboardStats);

router.get('/users', protect, isAdmin, getAllUsers); 
router.get('/requests', protect, isAdmin, getAllRequests); 

router.delete('/users/:id', protect, isAdmin, deleteUserById); 
router.delete('/requests/:id', protect, isAdmin, deleteRequestById); 

module.exports = router;