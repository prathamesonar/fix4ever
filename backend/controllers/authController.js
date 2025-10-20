const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const generateToken = require('../utils/generateToken');


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialty } = req.body; 

    const userExists = await User.findOne({ email }); 

    if (userExists) { //
      return res.status(400).json({ message: 'User already exists' }); 
    }

   
    const user = await User.create({ 
      name,
      email,
      password,
      role,
      specialty: role === 'Technician' ? specialty : undefined,
    });

    if (user) { 
      const userResponse = { 
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
        isAdmin: user.isAdmin, 
        availability: user.availability, 
        token: generateToken(user._id), 
      };
      res.status(201).json(userResponse); 
    } else {
      res.status(400).json({ message: 'Invalid user data' }); 
    }
  } catch (error) {
    console.error('Register Error:', error); 
    res.status(500).json({ message: 'Server Error' }); 
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password, isAdminLogin } = req.body;

    if (isAdminLogin === true) {
      console.log('Attempting special admin login...'); 
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        console.error('Admin email/password not set in .env file');
        return res.status(500).json({ message: 'Server configuration error.' });
      }

      if (email === adminEmail && password === adminPassword) {
        
        const adminUser = await User.findOne({ email: adminEmail, role: 'Admin' });

        if (!adminUser) {
          console.error(`Admin user with email ${adminEmail} not found in DB or is not set to role 'Admin'.`);
          return res.status(401).json({ message: 'Admin account not configured correctly in database.' });
        }

        console.log('Special admin login successful.');
        const userResponse = {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          specialty: adminUser.specialty,
          isAdmin: adminUser.isAdmin,
          availability: adminUser.availability,
          token: generateToken(adminUser._id),
        };
        return res.status(200).json(userResponse); 

      } else {
        console.log('Special admin login failed: Credentials mismatch.');
        return res.status(401).json({ message: 'Invalid admin credentials' }); 
      }
    }

    console.log('Attempting regular user/technician login...');
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      console.log('Regular login successful.');
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
        isAdmin: user.isAdmin,
        availability: user.availability,
        token: generateToken(user._id),
      };
      res.status(200).json(userResponse);
    } else {
      console.log('Regular login failed: Invalid email or password.');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body; 

  if (!oldPassword || !newPassword) { 
    return res.status(400).json({ message: 'Please provide old and new passwords' }); 
  }

  try {
    const user = await User.findById(req.user._id).select('+password'); 

    if (!user) { 
      return res.status(404).json({ message: 'User not found' }); 
    }

    if (!(await user.matchPassword(oldPassword))) { 
      return res.status(401).json({ message: 'Invalid old password' }); 
    }

    user.password = newPassword; 
    await user.save(); 

    res.json({ message: 'Password changed successfully' }); 
  } catch (error) {
    console.error('Change Password Error:', error); 
    res.status(500).json({ message: 'Server Error' }); 
  }
};


const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId); 

    if (!user) { 
      return res.status(404).json({ message: 'User not found' }); 
    }

    if (user.role === 'User') { 
      const activeJobs = await ServiceRequest.find({ 
        user: userId,
        status: { $in: ['Assigned', 'In Progress'] }
      });

      if (activeJobs.length > 0) { 
        return res.status(400).json({ message: 'Cannot delete account with active service requests.' }); 
      }
      await ServiceRequest.deleteMany({ user: userId }); 

    } else if (user.role === 'Technician') { 
      const activeJobs = await ServiceRequest.find({ 
        technician: userId,
        status: { $in: ['Assigned', 'In Progress'] }
      });

      if (activeJobs.length > 0) { 
        return res.status(400).json({ message: 'Cannot delete account with active jobs. Please complete them first.' }); 
      }
      await ServiceRequest.updateMany( 
        { technician: userId }, 
        { $unset: { technician: 1 } } 
      );
    }

    await User.findByIdAndDelete(userId); 

    res.json({ message: 'Account deleted successfully' }); 
  } catch (error) {
    console.error('Delete Account Error:', error); 
    res.status(500).json({ message: 'Server Error' }); 
  }
};



const updateTechnicianProfile = async (req, res) => {
    try {
        const technician = await User.findById(req.user._id); 

        if (!technician || technician.role !== 'Technician') { 
            return res.status(404).json({ message: 'Technician not found or user is not a technician' }); 
        }

        
        technician.name = req.body.name || technician.name; 
        technician.specialty = req.body.specialty || technician.specialty; 
        technician.bio = req.body.bio || technician.bio; 
        technician.yearsExperience = req.body.yearsExperience || technician.yearsExperience; 
        technician.certifications = req.body.certifications || technician.certifications; 

        const updatedTechnician = await technician.save(); 

        res.json({ 
            _id: updatedTechnician._id,
            name: updatedTechnician.name,
            email: updatedTechnician.email,
            role: updatedTechnician.role,
            specialty: updatedTechnician.specialty,
            availability: updatedTechnician.availability,
            bio: updatedTechnician.bio,
            yearsExperience: updatedTechnician.yearsExperience,
            certifications: updatedTechnician.certifications,
            averageRating: updatedTechnician.averageRating, 
            numReviews: updatedTechnician.numReviews 
        });
    } catch (error) {
        console.error('Update Profile Error:', error); 
        res.status(500).json({ message: 'Server Error updating profile' }); 
    }
};


const toggleAvailability = async (req, res) => {
    try {
        const technician = await User.findById(req.user._id); 

        if (!technician || technician.role !== 'Technician') { 
            return res.status(404).json({ message: 'Technician not found or user is not a technician' }); 
        }

        technician.availability = !technician.availability; 
        await technician.save(); 

        res.json({ availability: technician.availability }); 
    } catch (error) {
        console.error('Toggle Availability Error:', error); 
        res.status(500).json({ message: 'Server Error toggling availability' }); 
    }
};


module.exports = { 
  registerUser,
  loginUser,
  changePassword,
  deleteAccount,
  updateTechnicianProfile, 
  toggleAvailability,      
};