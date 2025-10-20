
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';

const TechnicianProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id: technicianId } = useParams(); 

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const { data } = await api.get(`/technicians/${technicianId}/profile`);
                setProfile(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load technician profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [technicianId]);

    if (loading) return <h2 className="text-2xl font-semibold text-center mt-10">Loading Profile...</h2>;
    if (error) return <h2 className="text-2xl font-semibold text-center text-red-500 mt-10">{error}</h2>;
    if (!profile) return <h2 className="text-2xl font-semibold text-center mt-10">Technician not found.</h2>;

     const renderCertifications = () => {
        if (!profile.certifications || profile.certifications.length === 0) {
            return <span className="text-gray-500 italic">None listed</span>;
        }
        return profile.certifications.join(', ');
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
             <div className="flex items-center mb-6">
                 <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold mr-6">
                    {profile.name ? profile.name[0].toUpperCase() : '?'}
                 </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-lg text-blue-600 font-semibold">{profile.specialty || 'General Technician'}</p>
                     <p className="text-sm text-yellow-500 font-bold">
                        {profile.averageRating > 0
                          ? `⭐ ${profile.averageRating} (${profile.numReviews} review${profile.numReviews !== 1 ? 's' : ''})`
                          : 'Not yet rated'}
                     </p>
                </div>
            </div>

             <div className="space-y-4">
                 {profile.bio && (
                     <div>
                         <h3 className="text-lg font-semibold text-gray-700 mb-1">About Me</h3>
                         <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
                     </div>
                 )}
                 <div>
                     <h3 className="text-lg font-semibold text-gray-700 mb-1">Experience</h3>
                     <p className="text-gray-600">
                        {profile.yearsExperience !== undefined && profile.yearsExperience !== null
                            ? `${profile.yearsExperience} year${profile.yearsExperience !== 1 ? 's' : ''}`
                            : <span className="text-gray-500 italic">Not specified</span>}
                     </p>
                 </div>
                 <div>
                     <h3 className="text-lg font-semibold text-gray-700 mb-1">Certifications</h3>
                     <p className="text-gray-600">{renderCertifications()}</p>
                 </div>
             </div>

             <div className="mt-8 text-center">
                 <Link to={-1} className="text-blue-600 hover:underline">
                     &larr; Go Back
                 </Link>
             </div>
        </div>
    );
};

export default TechnicianProfilePage;