import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';   
import { useAuth } from '../context/AuthContext.jsx';   

 const formInputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";   
const formTextAreaClasses = `${formInputClasses} min-h-[100px]`;   
const formButtonClasses = "bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50";   
const secondaryButtonClasses = "bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:opacity-50";     
const dangerButtonClasses = "w-full bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50";   

const SettingsPage = () => {
  const { userInfo, logout, addNotification, updateUserInfo } = useAuth();   
  const navigate = useNavigate();   

   const [showPasswordForm, setShowPasswordForm] = useState(false);  
  const [oldPassword, setOldPassword] = useState('');   
  const [newPassword, setNewPassword] = useState('');   
  const [confirmNewPassword, setConfirmNewPassword] = useState('');   
  const [passwordError, setPasswordError] = useState('');   
  const [passwordSuccess, setPasswordSuccess] = useState('');   
  const [passwordLoading, setPasswordLoading] = useState(false);   

   const [deleteError, setDeleteError] = useState('');   
  const [deleteLoading, setDeleteLoading] = useState(false);   

   const [techProfile, setTechProfile] = useState({   
    name: '', specialty: '', bio: '', yearsExperience: 0, certifications: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);   
  const [profileSuccess, setProfileSuccess] = useState('');   
  const [profileError, setProfileError] = useState('');   

   const [availabilityLoading, setAvailabilityLoading] = useState(false);   
  const [isAvailable, setIsAvailable] = useState(userInfo?.availability || false);   

   useEffect(() => {   
    if (userInfo?.role === 'Technician') {
        setTechProfile({
            name: userInfo.name || '',
            specialty: userInfo.specialty || '',
            bio: userInfo.bio || '',
            yearsExperience: userInfo.yearsExperience || 0,
            certifications: userInfo.certifications?.join(', ') || '',
        });
        setIsAvailable(userInfo.availability);
    }
  }, [userInfo]);

   const handleChangePassword = async (e) => {   
     e.preventDefault();
     setPasswordError('');
     setPasswordSuccess('');
     if (newPassword !== confirmNewPassword) { setPasswordError('New passwords do not match'); return; }
     setPasswordLoading(true);
     try {
       await api.put('/auth/changepassword', { oldPassword, newPassword });
       setPasswordSuccess('Password changed successfully!');
       addNotification('Password changed!', 'success');
        setOldPassword('');
       setNewPassword('');
       setConfirmNewPassword('');
       setShowPasswordForm(false);  
     } catch (err) {
         setPasswordError(err.response?.data?.message || 'Failed to change password.');
         addNotification(err.response?.data?.message || 'Failed to change password.', 'error');
     } finally {
         setPasswordLoading(false);
     }
   };

    const cancelPasswordChange = () => {
       setShowPasswordForm(false);
       setPasswordError('');
       setPasswordSuccess('');
       setOldPassword('');
       setNewPassword('');
       setConfirmNewPassword('');
   };

  const handleDeleteAccount = async () => {   
     setDeleteError('');
     if (window.confirm('Are you 100% sure? This cannot be undone.')) {
       setDeleteLoading(true);
       try {
         await api.delete('/auth/deleteaccount');
         logout();
         navigate('/login');
       } catch (err) {
           setDeleteError(err.response?.data?.message || 'Failed to delete account.');
           addNotification(err.response?.data?.message || 'Failed to delete account.', 'error');
        } finally {
            setDeleteLoading(false);
        }
     }
   };

  const handleProfileChange = (e) => {   
    setTechProfile({ ...techProfile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {   
    e.preventDefault();
    setProfileLoading(true); setProfileError(''); setProfileSuccess('');
    try {
        const profileData = {
            ...techProfile,
            certifications: techProfile.certifications.split(',').map(c => c.trim()).filter(c => c),
            yearsExperience: Number(techProfile.yearsExperience) >= 0 ? Number(techProfile.yearsExperience) : 0
        };
      const { data: updatedProfile } = await api.put('/auth/profile', profileData);
      updateUserInfo(updatedProfile);
      setProfileSuccess('Profile updated successfully!');
      addNotification('Profile updated!', 'success');
    } catch (err) {
        setProfileError(err.response?.data?.message || 'Failed to update profile.');
        addNotification(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
        setProfileLoading(false);
    }
  };

    const handleToggleAvailability = async () => {   
        setAvailabilityLoading(true);
        try {
            const { data } = await api.put('/auth/availability');
            setIsAvailable(data.availability);
            updateUserInfo({ availability: data.availability });
            addNotification(`Availability set to ${data.availability ? 'Available' : 'Unavailable'}`, 'success');
        } catch (err) {
             addNotification(err.response?.data?.message || 'Failed to toggle availability.', 'error');
        } finally {
            setAvailabilityLoading(false);
        }
    };


  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h2>

       {userInfo?.role === 'Technician' && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Technician Settings</h3>
            <div className="mb-6 flex items-center justify-center">
             <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isAvailable} onChange={handleToggleAvailability} disabled={availabilityLoading} className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span className={`ms-3 text-sm font-medium ${isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                {availabilityLoading ? 'Updating...' : (isAvailable ? 'Available for Jobs' : 'Unavailable')}
              </span>
            </label>
           </div>
           {profileSuccess && <p className="text-green-600 text-sm text-center mb-4">{profileSuccess}</p>}
          {profileError && <p className="text-red-500 text-sm text-center mb-4">{profileError}</p>}
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="techName" className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" id="techName" name="name" className={formInputClasses} value={techProfile.name} onChange={handleProfileChange} /></div>
                <div><label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label><input type="text" id="specialty" name="specialty" className={formInputClasses} value={techProfile.specialty} onChange={handleProfileChange} /></div>
                <div><label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label><input type="number" id="yearsExperience" name="yearsExperience" className={formInputClasses} value={techProfile.yearsExperience} onChange={handleProfileChange} min="0"/></div>
                 <div><label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">Certifications (comma-separated)</label><input type="text" id="certifications" name="certifications" className={formInputClasses} value={techProfile.certifications} onChange={handleProfileChange} placeholder="e.g., HVAC Certified, Licensed Plumber"/></div>
                 <div className="md:col-span-2"><label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label><textarea id="bio" name="bio" className={formTextAreaClasses} value={techProfile.bio} onChange={handleProfileChange} placeholder="Tell customers a bit about yourself..."></textarea></div>
            </div>
            <button type="submit" className={`${formButtonClasses} w-full md:w-auto`} disabled={profileLoading}>
              {profileLoading ? 'Saving Profile...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

       <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Change Password</h3>

         {!showPasswordForm ? (
             <div className="text-center">
                 {passwordSuccess && <p className="text-green-600 text-sm text-center mb-4">{passwordSuccess}</p>}
                 <button
                     type="button"
                     onClick={() => {
                         setShowPasswordForm(true);
                         setPasswordSuccess('');  
                     }}
                     className={`${formButtonClasses} w-auto`}  
                 >
                     Change Password
                 </button>
             </div>
         ) : (
            <form onSubmit={handleChangePassword} className="space-y-5">
              {passwordError && <p className="text-red-500 text-sm text-center">{passwordError}</p>}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                    <input type="password" id="oldPassword" className={formInputClasses} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" id="newPassword" className={formInputClasses} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" id="confirmNewPassword" className={formInputClasses} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                </div>
              </div>
               <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 pt-2">
                 <button type="submit" className={`${formButtonClasses} w-full md:w-auto`} disabled={passwordLoading}>
                     {passwordLoading ? 'Saving...' : 'Save New Password'}
                 </button>
                 <button type="button" onClick={cancelPasswordChange} className={`${secondaryButtonClasses} w-full md:w-auto`} disabled={passwordLoading}>
                     Cancel
                 </button>
              </div>
            </form>
         )}
      </div>

       <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg border border-red-200">
        <h3 className="text-2xl font-bold text-center text-red-700 mb-6">Delete Account</h3>
        <div className="space-y-5">
           {deleteError && <p className="text-red-500 text-sm text-center">{deleteError}</p>}
           <p className="text-center text-gray-600">Once you delete your account, there is no going back. This action cannot be undone.</p>
           <button onClick={handleDeleteAccount} className={dangerButtonClasses} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete My Account Permanently'}</button>
         </div>
      </div>
    </div>
  );
};

export default SettingsPage;