// src/App.jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { useState, useCallback, useEffect } from 'react';
import { socket } from './lib/socket';
import AlertFlashOverlay from './components/AlertFlashOverlay';


function AppContent() {
  const [flashAlert, setFlashAlert] = useState(null);
  const { user, isAuthenticated } = useAuth();   // ✅ now inside AuthProvider

  useEffect(() => {
    socket.connect();
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    function onConnect() {
      console.log('✅ Socket connected:', socket.id);
    }
    if (isAuthenticated){

    
    function onNewAlert(newAlert) {
      
      if (newAlert.user_id === user?.id) {
        return;
      }

      setFlashAlert(newAlert);
    }

    socket.on('connect', onConnect);
    socket.on('alert:new', onNewAlert);

    return () => {
      socket.off('connect', onConnect);
      socket.off('alert:new', onNewAlert);
    };
    }
  }, [user, isAuthenticated]);

  const handleDismiss = useCallback(() => setFlashAlert(null), []);

  return (
    <>
      <RouterProvider router={router} />
      <AlertFlashOverlay
        alert={flashAlert}
        onDismiss={handleDismiss}
      />
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


export default App;