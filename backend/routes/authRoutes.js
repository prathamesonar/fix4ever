const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
  deleteAccount,
  updateTechnicianProfile, 
  toggleAvailability,      
} = require('../controllers/authController');

const { protect, isTechnician } = require('../middleware/authMiddleware'); 

router.post('/register', registerUser);
router.post('/login', loginUser);

router.put('/changepassword', protect, changePassword);
router.delete('/deleteaccount', protect, deleteAccount);

router.put('/profile', protect, isTechnician, updateTechnicianProfile);
router.put('/availability', protect, isTechnician, toggleAvailability);

module.exports = router;