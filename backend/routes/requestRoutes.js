const express = require('express');
const router = express.Router();

const {
  createServiceRequest,
  getUserRequests,
  getAvailableRequests,
  assignRequest,
  updateRequestStatus,
  getTechnicianJobs,
  getRequestById,
  updateUserRequest,
  cancelUserRequest,
  submitReview,      
  getServiceHistory, 
} = require('../controllers/requestController');

const { protect, isTechnician } = require('../middleware/authMiddleware');

router.post('/', protect, createServiceRequest);
router.get('/myrequests', protect, getUserRequests);
router.get('/available', protect, isTechnician, getAvailableRequests);
router.get('/myjobs', protect, isTechnician, getTechnicianJobs);
router.get('/history', protect, getServiceHistory); 

router.get('/:id', protect, getRequestById);
router.put('/:id', protect, updateUserRequest);
router.put('/:id/cancel', protect, cancelUserRequest);
router.put('/:id/assign', protect, isTechnician, assignRequest);
router.put('/:id/status', protect, isTechnician, updateRequestStatus);
router.post('/:id/review', protect, submitReview); 

module.exports = router;