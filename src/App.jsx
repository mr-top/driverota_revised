import { useState, useEffect, useContext } from 'react';
import { ping } from './awConfig.js';

import { NotificationContext } from './context/NotificationContext.jsx';
import { ProfileContext } from './context/ProfileContext.jsx';

import { ID } from 'appwrite';

function App() {
  const { notifications, addNotification, toggleNotification, removeNotification } = useContext(NotificationContext);
  
  const { test2 } = useContext(ProfileContext);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function connect() {
      const result = await ping();

      if (result.success) {
        setConnected(true);
      } else {
        // raise error
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    }

    connect();
  }, [])

  return (
    <p>Perfect!</p>
  )
}

export default App
