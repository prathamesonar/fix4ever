const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');


const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTechnicians = await User.countDocuments({ role: 'Technician' });
        const pendingRequests = await ServiceRequest.countDocuments({ status: 'Pending' });
        const activeRequests = await ServiceRequest.countDocuments({ status: { $in: ['Assigned', 'In Progress'] } });
        const completedRequests = await ServiceRequest.countDocuments({ status: 'Completed' });

        const topTechnicians = await User.find({ role: 'Technician', numReviews: { $gt: 0 } })
            .sort({ averageRating: -1, numReviews: -1 }) 
            .limit(5)
            .select('name specialty averageRating numReviews'); 

        res.json({
            totalUsers,
            totalTechnicians,
            pendingRequests,
            activeRequests, 
            completedRequests,
            topTechnicians,
        });
    } catch (error) {
        console.error('Get Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Server Error fetching stats.' });
    }
};



const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getAllRequests = async (req, res) => {
     try {
        const requests = await ServiceRequest.find({})
            .populate('user', 'name email')
            .populate('technician', 'name email specialty')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Get All Requests Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === 'User' || user.role === 'Technician') {
           const activeJobs = await ServiceRequest.countDocuments({
              $or: [{ user: user._id }, { technician: user._id }],
              status: { $in: ['Assigned', 'In Progress'] }
           });
           if (activeJobs > 0) {
              return res.status(400).json({ message: `Cannot delete user with ${activeJobs} active job(s). Resolve jobs first.` });
           }
        }

        await User.findByIdAndDelete(req.params.id);
    

        res.json({ message: 'User removed successfully' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server Error deleting user' });
    }
};


const deleteRequestById = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Service Request not found' });
        }

        await ServiceRequest.findByIdAndDelete(req.params.id);

        res.json({ message: 'Service Request removed successfully' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Request ID format' });
        }
        console.error('Delete Request Error:', error);
        res.status(500).json({ message: 'Server Error deleting request' });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllRequests,
    deleteUserById,
    deleteRequestById,
};