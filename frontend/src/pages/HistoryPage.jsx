 import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

 const getStatusClasses = (status) => {
  let classes = "inline-block px-3 py-1 text-xs font-semibold rounded-full ";
  switch (status) {
    case 'Completed': return classes + "bg-green-100 text-green-800";
    case 'Cancelled': return classes + "bg-red-100 text-red-800";
    default: return classes + "bg-gray-100 text-gray-800";  
  }
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/requests/history');
        setHistory(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <h2 className="text-2xl font-semibold text-center mt-10">Loading History...</h2>;
  if (error) return <h2 className="text-2xl font-semibold text-center text-red-500 mt-10">{error}</h2>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Service History</h2>
      {history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">You have no completed or cancelled service requests in your history.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((req) => (
            <div className="bg-white rounded-lg shadow-md p-6 opacity-90" key={req._id}>  
               <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-700">{req.category}</h3>
                <span className={getStatusClasses(req.status)}>{req.status}</span>
              </div>
               <p className="text-gray-600 mb-4">{req.description}</p>
              <hr className="my-4" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><p className="font-medium text-gray-700">Address:</p><p className="text-gray-600">{req.address}</p></div>
                 {userInfo?.role === 'User' && req.technician && (
                    <div><p className="font-medium text-gray-700">Technician:</p><p className="text-gray-600">{req.technician.name} ({req.technician.specialty})</p></div>
                )}
                 {userInfo?.role === 'Technician' && req.user && (
                    <div><p className="font-medium text-gray-700">Customer:</p><p className="text-gray-600">{req.user.name}</p></div>
                )}
                 <div><p className="font-medium text-gray-700">{req.status === 'Completed' ? 'Completed On:' : 'Cancelled On:'}</p><p className="text-gray-600">{new Date(req.updatedAt).toLocaleString()}</p></div>
                 {req.userRating && (
                  <div className="md:col-span-2 mt-2 pt-2 border-t">
                     <p className="font-medium text-gray-700">User Rating: {'⭐'.repeat(req.userRating)}</p>
                     {req.userReview && <p className="text-gray-600 italic mt-1">"{req.userReview}"</p>}
                  </div>
                )}
              </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;