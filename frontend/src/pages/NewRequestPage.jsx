
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const formInputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const formSelectClasses = formInputClasses; 
const formTextAreaClasses = `${formInputClasses} min-h-[100px]`;
const formButtonClasses = "w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50";
const secondaryButtonClasses = "w-full bg-gray-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50";

 const timeSlots = [
    "Any Time",
    "Morning (8am - 12pm)",
    "Afternoon (12pm - 4pm)",
    "Evening (4pm - 8pm)"
];

const NewRequestPage = () => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [preferredDate, setPreferredDate] = useState('');  
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(timeSlots[0]);  
  const [preferredTechnician, setPreferredTechnician] = useState('');  

  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [availableTechnicians, setAvailableTechnicians] = useState([]);  
  const [loadingTechnicians, setLoadingTechnicians] = useState(false); 

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useAuth();

   useEffect(() => {
    const fetchTechnicians = async () => {
        if (!category) {
            setAvailableTechnicians([]);  
            return;
        }
        setLoadingTechnicians(true);
        try {
             const { data } = await api.get(`/technicians/available?specialty=${encodeURIComponent(category)}`);
            setAvailableTechnicians(data);
        } catch (err) {
            console.error("Failed to fetch technicians:", err);
             addNotification('Could not load available technicians for this category.', 'warning');
            setAvailableTechnicians([]); 
        } finally {
            setLoadingTechnicians(false);
        }
    };

     const debounceTimeout = setTimeout(() => {
        fetchTechnicians();
    }, 300);  

    return () => clearTimeout(debounceTimeout);  

  }, [category, addNotification]);  


   const getAiSuggestion = async () => {
    if (description.length < 10) {
      setError('Please provide a description (at least 10 characters).');
      return;
    }
    setError('');
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const { data } = await api.post('/ai/suggest', { description });   
      setAiSuggestion(data);
       setCategory(data.suggestedCategory || '');   
      if (data.message) {
          addNotification(data.message, 'warning');   
      } else {
          addNotification('AI suggestions loaded!', 'success');   
      }
    } catch (err) {
      setError('Could not get AI suggestion from server.');   
      addNotification('Could not get AI suggestion from server.', 'error');   
    } finally {
      setAiLoading(false);   
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description || !address) {
      setError('Please fill out category, description, and address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const requestData = {
        category,
        description,
        address,
        estimatedDuration: aiSuggestion?.estimatedDuration || null,   
        estimatedPrice: aiSuggestion?.estimatedPrice || null,   
        isUrgent: aiSuggestion?.isUrgent || false,   
        preferredDate: preferredDate || null,    
        preferredTimeSlot: preferredTimeSlot === timeSlots[0] ? null : preferredTimeSlot,  
        preferredTechnician: preferredTechnician || null,  
      };
      await api.post('/requests', requestData);   
      addNotification('Service request created successfully!', 'success');   
      navigate('/');   
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request.');   
      addNotification(err.response?.data?.message || 'Failed to create request.', 'error');   
    } finally {
      setLoading(false);   
    }
  };

    const getMinDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');  
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
   };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">New Service Request</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

         <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Describe your issue:</label>
          <textarea id="description" className={formTextAreaClasses} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., My kitchen sink is leaking water..." required/>
        </div>

         <div className="form-group">
          <button type="button" className={secondaryButtonClasses} onClick={getAiSuggestion} disabled={aiLoading || description.length < 10}>
            {aiLoading ? 'Analyzing...' : 'Get AI Suggestions (Category, Price, Urgency)'}
          </button>
        </div>

         {aiSuggestion && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md space-y-1 text-sm">
            {aiSuggestion.suggestedCategory && <p><strong>Suggested Category:</strong> {aiSuggestion.suggestedCategory}</p>}
            {aiSuggestion.estimatedDuration && <p><strong>Est. Duration:</strong> {aiSuggestion.estimatedDuration}</p>}
            {aiSuggestion.estimatedPrice && <p><strong>Est. Price:</strong> {aiSuggestion.estimatedPrice}</p>}
            {aiSuggestion.isUrgent !== undefined && <p><strong>Urgent:</strong> {aiSuggestion.isUrgent ? <span className="font-semibold text-red-600">Yes</span> : 'No'}</p>}
          </div>
        )}

         <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
          <input type="text" id="category" className={formInputClasses} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Confirm category or enter manually" required />
        </div>

         {category && (  
             <div>
               <label htmlFor="preferredTechnician" className="block text-sm font-medium text-gray-700 mb-1">
                   Preferred Technician (Optional)
                </label>
                 {loadingTechnicians ? (
                     <p className="text-sm text-gray-500">Loading technicians...</p>
                 ) : availableTechnicians.length > 0 ? (
                    <select
                        id="preferredTechnician"
                        value={preferredTechnician}
                        onChange={(e) => setPreferredTechnician(e.target.value)}
                        className={formSelectClasses}
                    >
                        <option value="">-- Select Available Technician (Optional) --</option>
                        {availableTechnicians.map(tech => (
                            <option key={tech._id} value={tech._id}>
                                {tech.name} ({tech.specialty}) - ⭐ {tech.averageRating || 'N/A'} ({tech.numReviews || 0})
                            </option>
                        ))}
                    </select>
                 ) : (
                    <p className="text-sm text-gray-500 italic">No technicians found for "{category}" or loading failed.</p>
                 )}
            </div>
        )}

         <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
          <input type="text" id="address" className={formInputClasses} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g., 123 Main St, Anytown" required />
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
                 />
             </div>
              <div>
                 <label htmlFor="preferredTimeSlot" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time (Optional)</label>
                 <select
                     id="preferredTimeSlot"
                     className={formSelectClasses}
                     value={preferredTimeSlot}
                     onChange={(e) => setPreferredTimeSlot(e.target.value)}
                 >
                     {timeSlots.map(slot => (
                         <option key={slot} value={slot}>{slot}</option>
                     ))}
                 </select>
             </div>
         </div>
 

        <button type="submit" className={formButtonClasses} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default NewRequestPage;