import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const getStatusClasses = (status) => {
    let classes = "inline-block px-3 py-1 text-xs font-semibold rounded-full ";
    switch (status) {
        case 'Pending': return classes + "bg-yellow-100 text-yellow-800";
        case 'Assigned': return classes + "bg-cyan-100 text-cyan-800";
        case 'In Progress': return classes + "bg-blue-100 text-blue-800";
        case 'Completed': return classes + "bg-green-100 text-green-800";
        case 'Cancelled': return classes + "bg-red-100 text-red-800";  
        default: return classes + "bg-gray-100 text-gray-800";
    }
};


const DashboardPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');  
  const navigate = useNavigate();
  const { addNotification } = useAuth();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/requests/myrequests'); 
      setRequests(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests.');  
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    fetchRequests();
  }, []); 

   const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        await api.put(`/requests/${id}/cancel`);  
        addNotification('Request cancelled successfully.', 'success'); 
        fetchRequests();  
      } catch (err) {
         addNotification(err.response?.data?.message || 'Failed to cancel request.', 'error'); 
      }
    }
  };

   const handleReview = async (id) => {
    const ratingInput = window.prompt("Please rate the service (1-5):");  
    const rating = parseInt(ratingInput);

    if (isNaN(rating) || rating < 1 || rating > 5) {
      addNotification("Invalid rating. Please enter a number between 1 and 5.", 'error');  
      return;
    }

    const review = window.prompt("Optional: Leave a short review:");  

    try {
      await api.post(`/requests/${id}/review`, { rating, review: review || '' });  
      fetchRequests();  
      addNotification("Review submitted successfully!", 'success');  
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to submit review.', 'error');  
    }
  };

   const filteredRequests = requests.filter(req => {
    if (filter === 'All') return true;  
    if (filter === 'Active') return req.status !== 'Completed' && req.status !== 'Cancelled';  
    if (filter === 'Completed') return req.status === 'Completed';   
     return true;  
  });

   const getButtonClasses = (buttonFilter) => {
    let base = "px-4 py-2 rounded-md font-medium transition-colors text-sm ";
    if (filter === buttonFilter) {
        if (buttonFilter === 'All') return base + "bg-blue-600 text-white";   
        if (buttonFilter === 'Active') return base + "bg-yellow-500 text-white";   
        if (buttonFilter === 'Completed') return base + "bg-green-600 text-white";   
    }
    return base + "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";   
  };


  if (loading) return <h2 className="text-2xl font-semibold text-center mt-10">Loading your requests...</h2>;   
   if (error && requests.length === 0) return <h2 className="text-2xl font-semibold text-center text-red-500 mt-10">{error}</h2>;   

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Service Requests</h2>
       {error && requests.length > 0 && <p className="text-red-500 text-center mb-4">{error}</p>}

       <div className="flex space-x-2 mb-6">  
        <button onClick={() => setFilter('All')} className={getButtonClasses('All')}>All Jobs</button>
        <button onClick={() => setFilter('Active')} className={getButtonClasses('Active')}>Active Jobs</button>
        <button onClick={() => setFilter('Completed')} className={getButtonClasses('Completed')}>Completed</button>
      </div>

       {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">  
             <p className="text-gray-600 mb-6">
                 {filter === 'All'
                     ? "You haven't made any service requests yet."
                     : `You have no ${filter.toLowerCase()} requests.`
                 }
             </p>
              {requests.length === 0 && (   
                 <Link
                     to="/new-request"
                     className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors"
                 >
                     Book a New Service
                 </Link>
             )}
         </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
             <div className="bg-white rounded-lg shadow-md p-4 md:p-6" key={req._id}>
               <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    {req.category}
                    {req.isUrgent && <span className="ml-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">URGENT</span>}
                 </h3>
                <span className={getStatusClasses(req.status)}>{req.status}</span>
              </div>
               <p className="text-gray-600 mb-4">{req.description}</p>
              <hr className="my-4" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><p className="font-medium text-gray-700">Address:</p><p className="text-gray-600">{req.address}</p></div>

                 {req.technician?._id ? (
                    <div>
                        <p className="font-medium text-gray-700">Technician:</p>
                        <p className="text-gray-600">
                           <Link to={`/technician/${req.technician._id}`} className="text-blue-600 hover:underline">{req.technician.name}</Link>
                            {req.technician.specialty ? ` (${req.technician.specialty})` : ''}
                            {req.technician.averageRating > 0 ? ` (${req.technician.averageRating} ★)` : ''}  
                         </p>
                    </div>
                ) : req.preferredTechnician?._id ? (  
                     <div>
                         <p className="font-medium text-gray-700">Preferred Technician:</p>
                         <p className="text-gray-500 italic">
                             {req.preferredTechnician.name} ({req.preferredTechnician.specialty || 'N/A'}) - Request Pending
                         </p>
                     </div>
                 ) : null}

                {req.estimatedDuration && (<div><p className="font-medium text-gray-700">Est. Duration:</p><p className="text-gray-600">{req.estimatedDuration}</p></div>)}  
                 {req.estimatedPrice && (<div><p className="font-medium text-gray-700">Est. Price:</p><p className="text-gray-600">{req.estimatedPrice}</p></div>)}  

                 {req.preferredDate && (
                    <div>
                        <p className="font-medium text-gray-700">Requested Date:</p>
                        <p className="text-gray-600">
                            {new Date(req.preferredDate).toLocaleDateString()}
                            {req.preferredTimeSlot && ` (${req.preferredTimeSlot})`}
                        </p>
                    </div>
                )}
                 {req.preferredTimeSlot && !req.preferredDate && (
                      <div>
                          <p className="font-medium text-gray-700">Requested Time:</p>
                          <p className="text-gray-600">{req.preferredTimeSlot}</p>
                      </div>
                 )}

                <div><p className="font-medium text-gray-700">Submitted:</p><p className="text-gray-600">{new Date(req.createdAt).toLocaleString()}</p></div>  
                 {req.status === 'Completed' && (<div><p className="font-medium text-gray-700">Completed:</p><p className="text-gray-600">{new Date(req.updatedAt).toLocaleString()}</p></div>)}  
                 {req.status === 'Cancelled' && (<div><p className="font-medium text-gray-700">Cancelled:</p><p className="text-gray-600">{new Date(req.updatedAt).toLocaleString()}</p></div>)}  

                 {req.userRating && (
                  <div className="md:col-span-2 mt-2 pt-2 border-t">
                     <p className="font-medium text-gray-700">Your Rating: {'⭐'.repeat(req.userRating)}</p>  
                     {req.userReview && <p className="text-gray-600 italic mt-1">"{req.userReview}"</p>}  
                  </div>
                )}
              </div>

               <div className="flex flex-wrap gap-2 mt-4">  
                {req.status === 'Pending' && <button onClick={() => navigate(`/request/${req._id}/edit`)} className="bg-gray-600 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-gray-700 transition-colors">Edit</button>}
                 {(req.status === 'Pending' || req.status === 'Assigned' || req.status === 'In Progress') && <button onClick={() => handleCancel(req._id)} className="bg-red-600 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-red-700 transition-colors">Cancel</button>}
                {req.status === 'Completed' && !req.userRating && <button onClick={() => handleReview(req._id)} className="bg-yellow-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-yellow-600 transition-colors">Leave Review</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;