const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); 

const authRoutes = require('./routes/authRoutes'); 
const requestRoutes = require('./routes/requestRoutes'); 
const aiRoutes = require('./routes/aiRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 
const technicianRoutes = require('./routes/technicianRoutes'); 

const app = express();
app.use(cors()); 
app.use(express.json()); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('MongoDB Connected successfully!'); 
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message); 
    process.exit(1); 
  }
};

connectDB(); 

app.get('/', (req, res) => res.send('Fix4Ever API is running!')); 

app.use('/api/auth', authRoutes); 
app.use('/api/requests', requestRoutes); 
app.use('/api/ai', aiRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/technicians', technicianRoutes); 

const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`)); 