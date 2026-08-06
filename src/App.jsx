import React, { useState, useEffect } from 'react';
import { initDB, getCurrentUser, logoutUser } from './utils/data';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import MemberPortal from './components/MemberPortal';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Initialize DB and load session
  useEffect(() => {
    initDB();
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
    showToast('Signed out successfully', 'success');
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`toast toast-${t.type}`}
            onClick={() => removeToast(t.id)}
            style={{ cursor: 'pointer' }}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Render Auth Screen first. Once signed in, load Admin or Member dashboard */}
      {!currentUser ? (
        <Auth onAuthSuccess={handleAuthSuccess} showToast={showToast} />
      ) : currentUser.role === 'admin' ? (
        <AdminDashboard user={currentUser} onSignOut={handleSignOut} showToast={showToast} />
      ) : (
        <MemberPortal user={currentUser} onSignOut={handleSignOut} showToast={showToast} />
      )}
    </div>
  );
}
