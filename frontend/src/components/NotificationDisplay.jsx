 import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const NotificationDisplay = () => {
  const { notifications } = useAuth();

  if (notifications.length === 0) {
    return null;
  }

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-400 text-green-700';
      case 'error': return 'bg-red-100 border-red-400 text-red-700';
      default: return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`border px-4 py-3 rounded relative shadow-md ${getNotificationStyle(n.type)}`}
          role="alert"
        >
          <span className="block sm:inline">{n.message}</span>
         </div>
      ))}
    </div>
  );
};

export default NotificationDisplay;