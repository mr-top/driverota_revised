import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ping } from './awConfig.js';

import { NotificationContext } from './context/NotificationContext.jsx';
import { ProfileContext } from './context/ProfileContext.jsx';

import { ID } from 'appwrite';

import MainLayout from './components/MainLayout.jsx';

function App() {
  const { notifications, addNotification, toggleNotification, removeNotification } = useContext(NotificationContext);

  const { logout } = useContext(ProfileContext);
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
    <div className='flex flex-col h-screen'>
      <BrowserRouter>
        <nav className='flex-initial bg-green-400 h-10'>

        </nav>
        <Routes>
          <Route path='/' element={<MainLayout />}>

            <Route>
              <Route path='/signin'>

              </Route>
              <Route path='/signup'>

              </Route>
            </Route>

          </Route>
        </Routes>
        <footer className='flex-initial bg-red-400 h-10'>

        </footer>
      </BrowserRouter>
    </div>
  )
}

export default App
