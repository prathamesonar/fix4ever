const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['User', 'Technician', 'Admin'], default: 'User' },  
  isAdmin: { type: Boolean, default: false },  

  specialty: { type: String, default: null },
  availability: { type: Boolean, default: true },  
  profilePic: { type: String, default: '' }, 
  bio: { type: String, default: '' },
  yearsExperience: { type: Number, default: 0 },
  certifications: { type: [String], default: [] },
   
  totalRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

}, { timestamps: true });

 
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (this.role === 'Admin') this.isAdmin = true;
  else this.isAdmin = false;
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.virtual('averageRating').get(function() {
  const numReviews = Number(this.numReviews);
  const totalRating = Number(this.totalRating);

  if (!Number.isFinite(numReviews) || numReviews <= 0) {
    return 0;  
  }
  if (!Number.isFinite(totalRating)) {
     
      return 0; 
  }

  return (totalRating / numReviews).toFixed(1);
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
module.exports = User;