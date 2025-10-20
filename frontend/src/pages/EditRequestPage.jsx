import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';   
import api from '../services/api.js';   

 const formInputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";   
const formSelectClasses = formInputClasses;
const formTextAreaClasses = `${formInputClasses} min-h-[100px]`;   
const formButtonClasses = "w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50";   
const secondaryButtonClasses = "w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-200";   

 const timeSlots = [
    "Any Time",
    "Morning (8am - 12pm)",
    "Afternoon (12pm - 4pm)",
    "Evening (4pm - 8pm)"
];

const EditRequestPage = () => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [preferredDate, setPreferredDate] = useState('');  
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(timeSlots[0]);  
  const [status, setStatus] = useState('');  

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);  

  const navigate = useNavigate();   
  const { id: requestId } = useParams();   

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        } catch (e) {
            console.error("Error formatting date:", e);
            return '';
        }
    };


   useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);   
      try {
        const { data } = await api.get(`/requests/${requestId}`);   
         setDescription(data.description);   
        setAddress(data.address);   
        setCategory(data.category);   
        setPreferredDate(formatDateForInput(data.preferredDate));  
        setPreferredTimeSlot(data.preferredTimeSlot || timeSlots[0]);  
        setStatus(data.status);  
         setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load request data.');   
      } finally {
        setLoading(false);   
      }
    };

    fetchRequest();
  }, [requestId]);   

    const getMinDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
   };


   const handleSubmit = async (e) => {
    e.preventDefault();
     if (status !== 'Pending') {
         setError('Cannot edit a request that is no longer pending.');
         return;
    }
    if (!category || !description || !address) {
      setError('Please fill out category, description, and address.');   
      return;
    }

    setLoading(true);   
    setError('');

    try {
       const updateData = {
          category,
          description,
          address,
          preferredDate: preferredDate || null,  
          preferredTimeSlot: preferredTimeSlot === timeSlots[0] ? null : preferredTimeSlot,  
       };
      await api.put(`/requests/${requestId}`, updateData);   

       
      navigate('/');   

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request.');   
    } finally {
      setLoading(false);   
    }
  };

  if (loading && !description) {  
     return <h2 className="text-2xl font-semibold text-center mt-10">Loading request...</h2>;
  }
   if (error && !description) {  
        return <h2 className="text-2xl font-semibold text-center text-red-500 mt-10">{error}</h2>;
   }


  const isEditable = status === 'Pending';  

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Service Request</h2>
       {!isEditable && (
            <p className="text-center text-orange-600 bg-orange-100 p-3 rounded-md mb-6 border border-orange-300">
                This request is no longer pending (Status: {status}) and cannot be edited.
            </p>
       )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

         <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Describe your issue:</label>
          <textarea
            id="description"
            className={formTextAreaClasses}
            value={description}
            onChange={(e) => setDescription(e.target.value)}   
            required
            disabled={!isEditable || loading}  
          />
        </div>

         <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
          <input
            type="text"
            id="category"
            className={formInputClasses}
            value={category}
            onChange={(e) => setCategory(e.target.value)}   
            required
            disabled={!isEditable || loading} 
          />
        </div>

         <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
          <input
            type="text"
            id="address"
            className={formInputClasses}
            value={address}
            onChange={(e) => setAddress(e.target.value)}   
            required
             disabled={!isEditable || loading}  
          />
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                 <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date (Optional)</label>
                 <input
                     type="date"
                     id="preferredDate"
                     className={formInputClasses}
                     value={preferredDate}
                     onChange={(e) => setPreferredDate(e.target.value)}
                     min={getMinDate()} 
                     disabled={!isEditable || loading} 
                 />
             </div>
              <div>
                 <label htmlFor="preferredTimeSlot" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time (Optional)</label>
                 <select
                     id="preferredTimeSlot"
                     className={formSelectClasses}
                     value={preferredTimeSlot}
                     onChange={(e) => setPreferredTimeSlot(e.target.value)}
                     disabled={!isEditable || loading}  
                 >
                     {timeSlots.map(slot => (
                         <option key={slot} value={slot}>{slot}</option>
                     ))}
                 </select>
             </div>
         </div>
 

        <button type="submit" className={formButtonClasses} disabled={!isEditable || loading}>
          {loading ? 'Saving...' : 'Save Changes'} {/* */}
        </button>
        <button type="button" onClick={() => navigate('/')} className={secondaryButtonClasses}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditRequestPage;