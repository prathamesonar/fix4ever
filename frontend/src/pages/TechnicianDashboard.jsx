
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

 const formInputClasses = "w-full md:w-auto px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";


const TechnicianDashboard = () => {
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loadingAvailable, setLoadingAvailable] = useState(true); 
  const [loadingMyJobs, setLoadingMyJobs] = useState(true);
  const [error, setError] = useState('');
  const [myJobsFilter, setMyJobsFilter] = useState('Active');  
  const [sortByUrgency, setSortByUrgency] = useState(false);  
  const [categoryFilter, setCategoryFilter] = useState('');  

  const { addNotification, userInfo } = useAuth();

   const fetchMyJobs = useCallback(async () => {
      setLoadingMyJobs(true);
      try {
          const myJobsRes = await api.get('/requests/myjobs');
          setMyJobs(myJobsRes.data);
           
      } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch your jobs.');
          setMyJobs([]);  
      } finally {
          setLoadingMyJobs(false);
      }
  }, []);

   const fetchAvailableJobs = useCallback(async () => {
      setLoadingAvailable(true);
      try {
           const params = new URLSearchParams();
          if (sortByUrgency) {
                params.append('sortByUrgency', 'true');
            }
          if (categoryFilter) {
                params.append('category', categoryFilter);
            }

          const availableRes = await api.get(`/requests/available?${params.toString()}`);
          setAvailableRequests(availableRes.data);
           setError('');
      } catch (err) {
          const errMsg = err.response?.data?.message || 'Failed to fetch available jobs.';
           setError(errMsg);  
           if (loadingAvailable) setAvailableRequests([]); 
       } finally {
          setLoadingAvailable(false);
      }
   }, [sortByUrgency, categoryFilter]);  

   useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  useEffect(() => {
      const debounceTimeout = setTimeout(() => {  
            fetchAvailableJobs();
        }, 300);  

        return () => clearTimeout(debounceTimeout);  
  }, [fetchAvailableJobs]);


   const handleAssign = async (id) => {
    try {
      await api.put(`/requests/${id}/assign`);
      addNotification('Job accepted!', 'success');
       fetchMyJobs();
      fetchAvailableJobs();  
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to assign job.', 'error');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/requests/${id}/status`, { status: newStatus });
      addNotification(`Job marked as "${newStatus}"!`, 'success');
      fetchMyJobs();  
    } catch (err) {
       addNotification(err.response?.data?.message || 'Failed to update job status.', 'error');
    }
  };

   const filteredMyJobs = myJobs.filter(job => {
    if (myJobsFilter === 'Active') return job.status === 'Assigned' || job.status === 'In Progress';
    if (myJobsFilter === 'Completed') return job.status === 'Completed';
     if (myJobsFilter === 'Cancelled') return job.status === 'Cancelled';  
    return false;  
  });

   const getButtonClasses = (buttonFilter) => {
    let base = "px-4 py-2 rounded-md font-medium transition-colors text-sm ";
    if (myJobsFilter === buttonFilter) {  
      return base + (
        buttonFilter === 'Active' ? "bg-blue-600 text-white" :
        buttonFilter === 'Completed' ? "bg-green-600 text-white" :
        "bg-red-600 text-white"  
      );
    }
    return base + "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
  };

 
  if (loadingMyJobs && loadingAvailable && myJobs.length === 0 && availableRequests.length === 0) {
       return <h2 className="text-2xl font-semibold text-center mt-10">Loading jobs...</h2>;
   }

  return (
    <div>
       {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}

       <div className="mb-4 flex flex-col sm:flex-row justify-end items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm font-medium">  
         <span>Status: <span className={userInfo?.availability ? 'text-green-600' : 'text-red-600'}>
              {userInfo?.availability ? 'Available' : 'Unavailable'}
          </span></span>
         <span>Rating: {userInfo?.averageRating > 0 ? `${userInfo.averageRating} ★ (${userInfo.numReviews} reviews)` : 'Not Rated'}</span>
      </div>

       <h2 className="text-3xl font-bold text-gray-800 mb-6">My Jobs</h2>
       <div className="flex space-x-2 mb-6">
        <button onClick={() => setMyJobsFilter('Active')} className={getButtonClasses('Active')}>Active</button>
        <button onClick={() => setMyJobsFilter('Completed')} className={getButtonClasses('Completed')}>Completed</button>
       </div>
       {loadingMyJobs ? <p>Loading my jobs...</p> : filteredMyJobs.length === 0 ? (
         <div className="bg-white rounded-lg shadow-md p-8 text-center mb-10"><p className="text-gray-600">You have no {myJobsFilter.toLowerCase()} jobs.</p></div>
      ) : (
        <div className="space-y-6 mb-10">
          {filteredMyJobs.map((job) => (
             <div className="bg-white rounded-lg shadow-md p-4 md:p-6" key={job._id}>  
               <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xl font-semibold text-gray-800 flex items-center flex-wrap gap-x-2">  
                    <span>{job.category}</span>
                    {job.isUrgent && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">URGENT</span>}
                 </h3>
                <span className={`${getStatusClasses(job.status)} flex-shrink-0 ml-2`}>{job.status}</span> 
              </div>
               <p className="text-gray-600 mb-4">{job.description}</p>
              <hr className="my-4" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                <div><p className="font-medium text-gray-700">Customer:</p><p className="text-gray-600">{job.user?.name || 'N/A'}</p></div>
                <div><p className="font-medium text-gray-700">Address:</p><p className="text-gray-600">{job.address}</p></div>
                {job.estimatedDuration && (<div><p className="font-medium text-gray-700">Est. Duration:</p><p className="text-gray-600">{job.estimatedDuration}</p></div>)}
                {job.estimatedPrice && (<div><p className="font-medium text-gray-700">Est. Price:</p><p className="text-gray-600">{job.estimatedPrice}</p></div>)}
                 {job.preferredDate && (
                    <div>
                        <p className="font-medium text-gray-700">Requested Date:</p>
                        <p className="text-gray-600">
                            {new Date(job.preferredDate).toLocaleDateString()}
                            {job.preferredTimeSlot && ` (${job.preferredTimeSlot})`}
                        </p>
                    </div>
                )}
                 {job.preferredTimeSlot && !job.preferredDate && (
                      <div>
                          <p className="font-medium text-gray-700">Requested Time:</p>
                          <p className="text-gray-600">{job.preferredTimeSlot}</p>
                      </div>
                 )}
                 {job.status === 'Completed' && (<div><p className="font-medium text-gray-700">Completed On:</p><p className="text-gray-600">{new Date(job.updatedAt).toLocaleString()}</p></div>)}
                 {job.status === 'Completed' && job.userRating && (
                    <div className="md:col-span-2 mt-2 pt-2 border-t">
                        <p className="font-medium text-gray-700">Customer Rating: {'⭐'.repeat(job.userRating)}</p>
                        {job.userReview && <p className="text-gray-600 italic mt-1">"{job.userReview}"</p>}
                    </div>
                 )}
              </div>
               <div className="flex flex-wrap gap-2">  
                {job.status === 'Assigned' && <button onClick={() => handleUpdateStatus(job._id, 'In Progress')} className="bg-blue-600 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-blue-700">Start Job</button>}
                {job.status === 'In Progress' && <button onClick={() => handleUpdateStatus(job._id, 'Completed')} className="bg-green-600 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-green-700">Complete Job</button>}
              </div>
            </div>
          ))}
        </div>
      )}

       <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Service Requests</h2>
        <div className="flex flex-col md:flex-row justify-end items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
              <div className="w-full md:w-auto">
                <label htmlFor="categoryFilter" className="sr-only">Filter by category</label>
                <input
                    type="text"
                    id="categoryFilter"
                    className={formInputClasses}
                    placeholder="Filter by category..."
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                />
             </div>
              <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={sortByUrgency} onChange={() => setSortByUrgency(prev => !prev)} className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900">Show Urgent First</span>
            </label>
        </div>

        {loadingAvailable ? <p>Loading available jobs...</p> : availableRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center"><p className="text-gray-600">{categoryFilter ? `No available jobs match "${categoryFilter}".` : 'No available jobs right now.'}</p></div>
      ) : (
        <div className="space-y-6">
          {availableRequests.map((req) => (
             <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 ${req.isUrgent ? 'border-l-4 border-red-500' : ''}`} key={req._id}>  
               <div className="flex justify-between items-start mb-2">
                 <h3 className="text-xl font-semibold text-gray-800 flex items-center flex-wrap gap-x-2">  
                     <span>{req.category}</span>
                     {req.isUrgent && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">URGENT</span>}
                 </h3>
                <span className={`${getStatusClasses(req.status)} flex-shrink-0 ml-2`}>{req.status}</span>  
              </div>
               <p className="text-gray-600 mb-4">{req.description}</p>
              <hr className="my-4" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                <div><p className="font-medium text-gray-700">Customer:</p><p className="text-gray-600">{req.user?.name || 'N/A'}</p></div>
                <div><p className="font-medium text-gray-700">Address:</p><p className="text-gray-600">{req.address}</p></div>
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
              </div>
               <button onClick={() => handleAssign(req._id)} disabled={!userInfo?.availability} className={`w-full md:w-auto text-white py-2 px-6 rounded-md font-semibold transition-colors ${!userInfo?.availability ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                {userInfo?.availability ? 'Accept Job' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;