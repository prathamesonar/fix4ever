const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

const createServiceRequest = async (req, res) => {
  try {
   
    const {
        category,
        description,
        address,
        estimatedDuration,
        estimatedPrice,
        isUrgent,
        preferredTechnician, 
        preferredDate,      
        preferredTimeSlot   
    } = req.body;
    const user = req.user._id;

    if (!category || !description || !address) {
      return res.status(400).json({ message: 'Please provide category, description, and address.' });
    }

    const request = new ServiceRequest({
      user,
      category,
      description,
      address,
      estimatedDuration, 
      estimatedPrice,    
      isUrgent,         
      preferredTechnician: preferredTechnician || null, 
      preferredDate: preferredDate || null,           
      preferredTimeSlot: preferredTimeSlot || null,    
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    console.error('Create Request Error:', error.message);
    res.status(500).json({ message: 'Server Error creating request' });
  }
};

const getUserRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id })
      .populate('technician', 'name specialty averageRating') 
      .populate('preferredTechnician', 'name specialty')
      .sort({ createdAt: -1 }); 

    res.json(requests);
  } catch (error) {
    console.error('Get User Requests Error:', error.message);
    res.status(500).json({ message: 'Server Error getting user requests' });
  }
 };

const getAvailableRequests = async (req, res) => {
  try {
    const { sortByUrgency, category } = req.query; 

    let sortOptions = { createdAt: 1 }; 
    if (sortByUrgency === 'true') {
        sortOptions = { isUrgent: -1, createdAt: 1 }; 
    }

    const query = {
        status: 'Pending',
    };

    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }

   

    const requests = await ServiceRequest.find(query)
      .populate('user', 'name')
      .sort(sortOptions);

    res.json(requests);
  } catch (error) {
    console.error('Get Available Requests Error:', error.message);
    res.status(500).json({ message: 'Server Error getting available requests' });
  }
};

const assignRequest = async (req, res) => {
 try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'This request is no longer available.' });
    }

    if (!req.user.availability) { //
        return res.status(400).json({ message: 'You are currently set to unavailable. Cannot accept jobs.' });
    }

    request.technician = req.user._id;
    request.status = 'Assigned';

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error('Assign Request Error:', error.message);
    res.status(500).json({ message: 'Server Error assigning request' });
  }
 };

const updateRequestStatus = async (req, res) => {
 const { status } = req.body;

  if (status !== 'In Progress' && status !== 'Completed') {
    return res.status(400).json({ message: 'Invalid status update.' });
  }

  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (!request.technician || request.technician.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'You are not authorized to update this request.' });
    }

    if (status === 'Completed' && request.status !== 'In Progress') {
      return res.status(400).json({ message: 'Cannot complete a request that is not "In Progress".' });
    }
    if (status === 'In Progress' && request.status !== 'Assigned') {
      return res.status(400).json({ message: 'Request must be "Assigned" before "In Progress".' });
    }

    request.status = status;
    const updatedRequest = await request.save();

    if (status === 'Completed') {
    }

    res.json(updatedRequest);

  } catch (error) {
    console.error('Update Status Error:', error.message);
    res.status(500).json({ message: 'Server Error updating status' });
  }
 };

const getTechnicianJobs = async (req, res) => {
  try {
    const jobs = await ServiceRequest.find({
      technician: req.user._id,
      status: { $in: ['Assigned', 'In Progress', 'Completed'] } 
    })
    .populate('user', 'name address')
    .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get Tech Jobs Error:', error.message);
    res.status(500).json({ message: 'Server Error getting tech jobs' });
  }
};


const getRequestById = async (req, res) => {
 try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const isOwner = request.user.toString() === req.user._id.toString();
    const isAssignedTech = request.technician && request.technician.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin; //

    if (!isOwner && !isAssignedTech && !isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await request.populate('user', 'name email');
    if (request.technician) {
        await request.populate('technician', 'name email specialty averageRating numReviews'); //
    }
     if (request.preferredTechnician) {
        await request.populate('preferredTechnician', 'name specialty');
    }


    res.json(request);
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid request ID format' });
    }
    console.error('Get Request By ID Error:', error.message);
    res.status(500).json({ message: 'Server Error getting request by ID' });
  }
 };

const updateUserRequest = async (req, res) => {
 try {
    const { category, description, address, preferredDate, preferredTimeSlot } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    
    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot edit a request that is no longer pending' });
    }

    request.category = category || request.category;
    request.description = description || request.description;
    request.address = address || request.address;
    request.preferredDate = preferredDate || request.preferredDate; 
    request.preferredTimeSlot = preferredTimeSlot || request.preferredTimeSlot; 

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error('Update Request Error:', error.message);
    res.status(500).json({ message: 'Server Error updating request' });
  }
 };

const cancelUserRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    if (!['Pending', 'Assigned', 'In Progress'].includes(request.status)) {
        return res.status(400).json({ message: `Cannot cancel a request with status "${request.status}"` });
    }
    request.status = 'Cancelled';
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error('Cancel Request Error:', error.message);
    res.status(500).json({ message: 'Server Error canceling request' });
  }
};


const submitReview = async (req, res) => {
    const { rating, review } = req.body;
    const requestId = req.params.id;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Please provide a rating between 1 and 5.' });
    }

    try {
        const request = await ServiceRequest.findById(requestId);

        if (!request) return res.status(404).json({ message: 'Request not found.' });
        if (request.user.toString() !== userId.toString()) return res.status(401).json({ message: 'Not authorized.' });
        if (request.status !== 'Completed') return res.status(400).json({ message: 'Cannot review an incomplete job.' });
        if (request.userRating) return res.status(400).json({ message: 'Job already reviewed.' });
        if (!request.technician) return res.status(400).json({ message: 'Cannot review job with no technician.'});

        request.userRating = rating;
        request.userReview = review || ''; 
        await request.save();

        const technician = await User.findById(request.technician);
        if (technician) {
            technician.totalRating = (technician.totalRating || 0) + rating; 
            technician.numReviews = (technician.numReviews || 0) + 1; 
            await technician.save();
        }

        res.status(201).json({ message: 'Review submitted successfully.' });
    } catch (error) {
        console.error('Submit Review Error:', error);
        res.status(500).json({ message: 'Server Error submitting review.' });
    }
};

const getServiceHistory = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'User') {
            query = { user: req.user._id };
        } else if (req.user.role === 'Technician') {
            query = { technician: req.user._id };
        } else if (req.user.isAdmin) {
             query = {};
        }
         else {
             return res.status(403).json({ message: 'Invalid role for history.' });
        }

        query.status = { $in: ['Completed', 'Cancelled'] };

        const history = await ServiceRequest.find(query)
            .populate('user', 'name')
            .populate('technician', 'name specialty')
            .sort({ updatedAt: -1 }); 

        res.json(history);
    } catch (error) {
        console.error('Get History Error:', error);
        res.status(500).json({ message: 'Server Error getting history.' });
    }
};



module.exports = {
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
};