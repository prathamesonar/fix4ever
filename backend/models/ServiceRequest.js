const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  category: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  estimatedDuration: { type: String, default: null },
  estimatedPrice: { type: String, default: null },
  isUrgent: { type: Boolean, default: false },
  userRating: { type: Number, min: 1, max: 5, default: null },
  userReview: { type: String, default: null },

  preferredTechnician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },  
  preferredDate: { type: Date, default: null },  
  preferredTimeSlot: { type: String, default: null },  

}, { timestamps: true });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports = ServiceRequest;