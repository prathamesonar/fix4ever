import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';  

const Header = () => {
  const { userInfo, logout } = useAuth();  
  const navigate = useNavigate();  
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = () => {
    logout();  
    setIsMenuOpen(false);   
    navigate('/login');  
  };

  const ProfileIcon = () => {
    if (!userInfo) return null;  

    const initial = userInfo.name ? userInfo.name[0].toUpperCase() : '?';  
    let roleClass = 'bg-blue-600';  
    let titleText = `Logged in as User: ${userInfo.name}`;  

    if (userInfo.role === 'Technician') {  
        roleClass = 'bg-green-600';  
        const rating = userInfo.averageRating ? ` (${userInfo.averageRating} ★)` : '';  
        titleText = `Logged in as Technician: ${userInfo.name}${rating}`;  
    } else if (userInfo.isAdmin) {  
        roleClass = 'bg-purple-600';  
        titleText = `Logged in as Admin: ${userInfo.name}`;  
    }

    return (
       <div className="flex items-center space-x-2">
         <div
          className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full text-white font-bold text-xs md:text-sm ${roleClass}`}  
          title={titleText}  
        >
          {initial}
        </div>
         <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"> 
           <svg className="w-6 h-6 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    );
  };

  const mobileNavLinkClasses = "block py-2 px-4 text-gray-700 hover:bg-gray-100";
  const mobileNavButtonClasses = "block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors mt-2";
  const desktopNavLinkClasses = "text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200";
  const desktopNavButtonClasses = "bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 ml-4"; 


    const renderNavLinks = (isMobile = false) => {
    const handleLinkClick = () => setIsMenuOpen(false);  
    const commonClasses = isMobile ? mobileNavLinkClasses : desktopNavLinkClasses;
    const buttonClasses = isMobile ? mobileNavButtonClasses : desktopNavButtonClasses;

     const commonLoggedInLinks = !userInfo?.isAdmin ? (
      <>
        <li><Link to="/history" className={commonClasses} onClick={handleLinkClick}>History</Link></li>
        <li><Link to="/settings" className={commonClasses} onClick={handleLinkClick}>Settings</Link></li>
      </>
    ) : null;

     if (!userInfo) {
      return (
        <>
          
           {isMobile && (
            <>
              <li><Link to="/" className={commonClasses} onClick={handleLinkClick}>Home</Link></li>
              <li><Link to="/login" className={commonClasses} onClick={handleLinkClick}>Login</Link></li>
              <li><Link to="/register" className={buttonClasses} onClick={handleLinkClick}>Register</Link></li>
            </>
          )}
        </>
      );
    }

     if (userInfo.role === 'User') {
      return (
        <>
          <li><Link to="/dashboard" className={commonClasses} onClick={handleLinkClick}>My Dashboard</Link></li>
          {commonLoggedInLinks}
          {userInfo.isAdmin && (
               <li><Link to="/admin" className={commonClasses} onClick={handleLinkClick}>Admin Panel</Link></li>
          )}
            <li><Link to="/new-request" className={buttonClasses} onClick={handleLinkClick}>New Request</Link></li>
        </>
      );
    } else if (userInfo.role === 'Technician') {
       return (
           <>
               <li><Link to="/tech-dashboard" className={commonClasses} onClick={handleLinkClick}>Job Dashboard</Link></li>
               {commonLoggedInLinks}
               {userInfo.isAdmin && (
                   <li><Link to="/admin" className={commonClasses} onClick={handleLinkClick}>Admin Panel</Link></li>
               )}
           </>
       );
    } else if (userInfo.role === 'Admin') {
       return (
           <>
               <li><Link to="/admin" className={commonClasses} onClick={handleLinkClick}>Admin Panel</Link></li>
            </>
       );
    }

    return null;  
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">  
       <div className="max-w-6xl mx-auto p-4 flex justify-between items-center flex-wrap">  
         <Link to="/" className="text-2xl font-bold text-blue-600 mr-auto" onClick={() => setIsMenuOpen(false)}>  
          Fix4Ever
        </Link>

         <div className="hidden md:flex md:items-center md:space-x-6" id="navbar-desktop-links">
             <ul className="flex flex-row space-x-6 mt-0 text-sm font-medium">  
                 {renderNavLinks(false)}
            </ul>
        </div>


         <div className="flex items-center space-x-2 md:order-last">  

           {userInfo ? (
             <div className={`${isMenuOpen ? 'hidden md:flex' : 'flex'}`}>
              <ProfileIcon />
            </div>
          ) : (
             <div className="hidden md:flex md:items-center space-x-4">
              <Link to="/" className={desktopNavLinkClasses}>Home</Link>
              <Link to="/login" className={desktopNavLinkClasses}>Login</Link>
              <Link to="/register" className={desktopNavButtonClasses}>Register</Link>
            </div>
          )}

           <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
        </div>


         <div
          className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:hidden`}  
          id="navbar-mobile-menu"
        >
          <ul className="flex flex-col mt-4 border border-gray-100 rounded-lg bg-gray-50">
              {renderNavLinks(true)}
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Header;