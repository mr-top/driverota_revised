import { useState, useEffect } from 'react';
import { ping } from './awConfig.js';

function App() {
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
    <p className="bg-red-200">Hello</p>
  )
}

export default App
