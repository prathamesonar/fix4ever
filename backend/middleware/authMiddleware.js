const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isTechnician = (req, res, next) => {
  if (req.user && req.user.role === 'Technician') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Access restricted to technicians.' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {  
        next();
    } else {
        res.status(403).json({ message: 'Forbidden. Access restricted to administrators.' });
    }
};

module.exports = { protect, isTechnician, isAdmin };  