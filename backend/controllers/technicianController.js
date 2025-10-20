const User = require('../models/User');


const getAvailableTechnicians = async (req, res) => {
    try {
        const { specialty } = req.query;

        const query = {
            role: 'Technician',
            availability: true
        };

        if (specialty) {
            query.specialty = { $regex: specialty, $options: 'i' };
        }

        const technicians = await User.find(query)
            .select('name specialty averageRating numReviews') 
            .sort({ averageRating: -1, numReviews: -1 }); 

        res.json(technicians);

    } catch (error) {
        console.error('Get Available Technicians Error:', error);
        res.status(500).json({ message: 'Server Error fetching technicians.' });
    }
};


const getTechnicianProfile = async (req, res) => {
    try {
        const technician = await User.findById(req.params.id);

        if (!technician || technician.role !== 'Technician') {
            return res.status(404).json({ message: 'Technician not found.' });
        }

        res.json({
            _id: technician._id,
            name: technician.name,
            specialty: technician.specialty,
            profilePic: technician.profilePic,
            bio: technician.bio,
            yearsExperience: technician.yearsExperience,
            certifications: technician.certifications,
            averageRating: technician.averageRating, 
            numReviews: technician.numReviews,       
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid Technician ID format' });
        }
        console.error('Get Technician Profile Error:', error);
        res.status(500).json({ message: 'Server Error fetching technician profile.' });
    }
};

module.exports = {
    getAvailableTechnicians,
    getTechnicianProfile,
};