import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';  

const HomePage = () => {
    const { userInfo } = useAuth();

     const primaryButtonClasses = "inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors text-lg mr-4 mb-4";
    const secondaryButtonClasses = "inline-block bg-gray-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-gray-700 transition-colors text-lg mb-4";

    return (
        <div className="text-center mt-10 md:mt-20 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Welcome to Fix4Ever! 
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Your reliable marketplace for connecting with skilled technicians for all your home and electronic repair needs. Fast, easy, and efficient service booking at your fingertips.
            </p>

             <div className="space-x-0 md:space-x-4">
                {!userInfo && (
                    <>
                        <Link to="/register" className={primaryButtonClasses}>
                            Get Started (Need Service)
                        </Link>
                         <Link to="/register" className={secondaryButtonClasses}>
                             Become a Technician
                         </Link>
                    </>
                )}
                {userInfo?.role === 'User' && (
                     <Link to="/new-request" className={primaryButtonClasses}>
                         Book a New Service
                     </Link>
                )}
                 {userInfo?.role === 'Technician' && (
                     <Link to="/tech-dashboard" className={primaryButtonClasses}>
                         View Available Jobs
                     </Link>
                )}
                 {userInfo?.role === 'Admin' && (
                     <Link to="/admin" className={primaryButtonClasses}>
                         Go to Admin Panel
                     </Link>
                )}
                 {userInfo && userInfo.role !== 'User' && (
                    <Link to={userInfo.role === 'Admin' ? '/admin' : '/tech-dashboard'} className={secondaryButtonClasses}>
                        Go to My Dashboard
                    </Link>
                )}
                 {userInfo && userInfo.role === 'User' && (
                    <Link to="/dashboard" className={secondaryButtonClasses}>
                        Go to My Dashboard
                    </Link>
                 )}

            </div>
        </div>
    );
};

export default HomePage;