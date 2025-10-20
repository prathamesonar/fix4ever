import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js'; 
import { useAuth } from '../context/AuthContext.jsx';

const deleteButtonClasses = "text-red-600 hover:text-red-900 text-xs font-medium disabled:opacity-50";
const StatCard = ({ title, value, loading }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h4>
        {loading ? (
            <div className="h-8 bg-gray-200 rounded animate-pulse mt-1"></div>
        ) : (
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mt-1">{value !== undefined ? value : 'N/A'}</p>  
        )}
    </div>
);


const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { addNotification, userInfo } = useAuth();

  const fetchData = async () => {
    setLoadingUsers(true);
    setLoadingRequests(true);
    setLoadingStats(true);
    setError('');
    try {
      const [statsRes, usersRes, requestsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/requests')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to load admin data.';
      setError(errMsg);
      addNotification(errMsg, 'error');
    } finally {
      setLoadingStats(false);
      setLoadingUsers(false);
      setLoadingRequests(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userIdToDelete) => {
    if (userIdToDelete === userInfo?._id) {
        addNotification('You cannot delete your own account.', 'warning');
        return;
    }
    if (window.confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) {
      setDeletingId(userIdToDelete);
      try {
        await api.delete(`/admin/users/${userIdToDelete}`);
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToDelete));
        addNotification('User deleted successfully.', 'success');
        setLoadingStats(true); api.get('/admin/stats').then(res => setStats(res.data)).finally(() => setLoadingStats(false));
      } catch (err) {
        addNotification(err.response?.data?.message || 'Failed to delete user.', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteRequest = async (requestIdToDelete) => {
    if (window.confirm('Are you sure you want to permanently delete this service request? This cannot be undone.')) {
      setDeletingId(requestIdToDelete);
      try {
        await api.delete(`/admin/requests/${requestIdToDelete}`);
        setRequests(prevRequests => prevRequests.filter(req => req._id !== requestIdToDelete));
        addNotification('Service request deleted successfully.', 'success');
        setLoadingStats(true); api.get('/admin/stats').then(res => setStats(res.data)).finally(() => setLoadingStats(false));
      } catch (err) {
        addNotification(err.response?.data?.message || 'Failed to delete request.', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };


  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
       {error && !loadingStats && !loadingUsers && !loadingRequests && <p className="text-red-500 text-center mb-4">{error}</p>}

       <section className="mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"> 
            <StatCard title="Total Users" value={stats.totalUsers} loading={loadingStats} />
            <StatCard title="Technicians" value={stats.totalTechnicians} loading={loadingStats} />
            <StatCard title="Pending Jobs" value={stats.pendingRequests} loading={loadingStats} />
            <StatCard title="Active Jobs" value={stats.activeRequests} loading={loadingStats} />
            <StatCard title="Completed Jobs" value={stats.completedRequests} loading={loadingStats} />
       </section>

        {!loadingStats && stats.topTechnicians && stats.topTechnicians.length > 0 && (
            <section className="mb-10">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Top Rated Technicians</h3>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {stats.topTechnicians.map((tech) => (
                             <li key={tech._id} className="px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm space-y-1 sm:space-y-0"> 
                                <div>
                                    <Link to={`/technician/${tech._id}`} className="font-medium text-blue-600 hover:underline">{tech.name}</Link>
                                    <span className="text-gray-500 ml-2">({tech.specialty || 'N/A'})</span>
                                </div>
                                <span className="font-semibold text-yellow-500">
                                    ⭐ {tech.averageRating} ({tech.numReviews})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        )}


       <section className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Manage Users ({loadingUsers ? '...' : users.length})</h3>
        {loadingUsers ? <p>Loading users...</p> : (
           <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">  
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">  
                {users.map((user) => (
                  <tr key={user._id}>  
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">  
                        {user.role === 'Technician' ? (
                             <Link to={`/technician/${user._id}`} className="text-blue-600 hover:underline">{user.name}</Link>
                        ) : (
                            user.name
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  
                        {new Date(user.createdAt).toLocaleDateString() === 'Invalid Date'
                            ? 'N/A'
                            : new Date(user.createdAt).toLocaleDateString()
                        }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">  
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className={deleteButtonClasses}
                        disabled={deletingId === user._id || user._id === userInfo?._id}
                      >
                        {deletingId === user._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center text-gray-500 py-4">No users found.</p>}
          </div>
        )}
      </section>

       <section>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Manage Service Requests ({loadingRequests ? '...' : requests.length})</h3>
        {loadingRequests ? <p>Loading requests...</p> : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200"> 
               <thead className="bg-gray-50">  
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">  
                {requests.map((req) => (
                  <tr key={req._id}>  
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(req.status).replace('inline-block','').replace('px-3','').replace('py-1','')}`}>{req.status}</span></td>  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.category}</td>  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.user?.name || 'N/A'}</td>  
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  
                       {req.technician?._id ? (
                            <Link to={`/technician/${req.technician._id}`} className="text-blue-600 hover:underline">{req.technician.name}</Link>
                       ) : (
                           'N/A'
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleString()}</td>  
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">  
                       <button
                         onClick={() => handleDeleteRequest(req._id)}
                         className={deleteButtonClasses}
                         disabled={deletingId === req._id}
                        >
                          {deletingId === req._id ? 'Deleting...' : 'Delete'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {requests.length === 0 && <p className="text-center text-gray-500 py-4">No service requests found.</p>}
           </div>
        )}
      </section>
    </div>
  );
};

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


export default AdminPage;