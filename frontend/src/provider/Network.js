import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

// Network status wrapper component
const NetworkWrapper = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [wasOffline, setWasOffline] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { loggedIn } = useContext(AuthContext);
  
    useEffect(() => {
      // Store current path for restoration when connection returns
      if (isOnline && location.pathname !== '/offline') {
        sessionStorage.setItem('lastPath', location.pathname);
      }
  
      const handleOnline = () => {
        setIsOnline(true);
        
        // Auto-redirect when connection is restored
        if (wasOffline || location.pathname === '/offline') {
          const lastPath = sessionStorage.getItem('lastPath') || '/';
          navigate(lastPath);
          setWasOffline(false);
        }
      };
  
      const handleOffline = () => {
        setIsOnline(false);
        setWasOffline(true);
      };
  
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
  
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, [location.pathname, isOnline, wasOffline, navigate]);
  
    // If offline and not already on offline page, show offline page
    if (!isOnline && location.pathname !== '/offline') {
      return <OfflinePage />;
    }
  
    // Important: Return the Outlet to render the nested routes
    return <Outlet />;
  };

export default NetworkWrapper;


const OfflinePage = () => {
    const navigate = useNavigate();
    
    const handleRetry = () => {
      // Try to reload and go back to previous page if we're back online
      if (navigator.onLine) {
        const lastPath = sessionStorage.getItem('lastPath') || '/';
        navigate(lastPath);
      } else {
        window.location.reload();
      }
    };
  
    return (
      <div className="offline-container">
        <h1>Keine Internetverbindung</h1>
        <p>Überprüfen Sie Ihre Netzwerkverbindung</p>
        <button 
          onClick={handleRetry}
        >
          Wiederverbinden
        </button>
      </div>
    );
  };
  