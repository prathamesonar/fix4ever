 import React from 'react';
import { Routes, Route } from 'react-router-dom';

 import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';  
import PrivateRoute from './components/PrivateRoute.jsx';
import NotificationDisplay from './components/NotificationDisplay.jsx';

 import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

 import DashboardPage from './pages/DashboardPage.jsx';
import NewRequestPage from './pages/NewRequestPage.jsx';
import EditRequestPage from './pages/EditRequestPage.jsx';

 import TechnicianDashboard from './pages/TechnicianDashboard.jsx';
import TechnicianProfilePage from './pages/TechnicianProfilePage.jsx';

 import SettingsPage from './pages/SettingsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function App() {
  return (
     <div className="App bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <NotificationDisplay />
       <main className="flex-grow max-w-6xl mx-auto p-4 md:p-6 mt-4 w-full"> {/* */}
        <Routes>
           <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

           <Route path="/dashboard" element={<PrivateRoute role="User" />}>
            <Route index element={<DashboardPage />} />
          </Route>
          <Route path="/new-request" element={<PrivateRoute role="User" />}>
            <Route index element={<NewRequestPage />} />
          </Route>
          <Route path="/request/:id/edit" element={<PrivateRoute role="User" />}>
            <Route index element={<EditRequestPage />} />
          </Route>

           <Route path="/tech-dashboard" element={<PrivateRoute role="Technician" />}>
            <Route index element={<TechnicianDashboard />} />
          </Route>

            <Route path="/technician/:id" element={<PrivateRoute allowAnyLoggedIn={true} />}>
                <Route index element={<TechnicianProfilePage />} />
            </Route>

           <Route path="/settings" element={<PrivateRoute allowAnyLoggedIn={true} />}>
            <Route index element={<SettingsPage />} />
          </Route>
          <Route path="/history" element={<PrivateRoute allowAnyLoggedIn={true} />}>
            <Route index element={<HistoryPage />} />
          </Route>

           <Route path="/admin" element={<PrivateRoute role="Admin" />}>
            <Route index element={<AdminPage />} />
          </Route>

           <Route path="*" element={<h2 className="text-2xl font-bold text-center mt-10">404 - Page Not Found</h2>} />
        </Routes>
      </main>
      <Footer />  
    </div>
  );
}

export default App;