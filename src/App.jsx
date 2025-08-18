import { useState, useEffect, useContext } from 'react';
import { ping } from './awConfig.js';

import { NotificationContext } from './context/NotificationContext.jsx';

function App() {
  const { test } = useContext(NotificationContext);
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
    <p className="bg-red-200 btn">Hello {test}</p>
  )
}

export default App
