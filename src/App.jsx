import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ping } from './awConfig.js';

import { NotificationContext } from './context/NotificationContext.jsx';
import { ProfileContext } from './context/ProfileContext.jsx';

import { ID } from 'appwrite';

import ProfileRoute from './components/redirects/ProfileRoute.jsx';
import ProtectedRoute from './components/redirects/ProtectedRoute.jsx';
import GuestRoute from './components/redirects/GuestRoute.jsx';
import MainLayout from './components/MainLayout.jsx';
import Signin from './components/Signin.jsx';
import Signup from './components/Signup.jsx';

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

            <Route element={<ProfileRoute />}>

              <Route element={<ProtectedRoute />}>

              </Route>

              <Route element={<GuestRoute />}>
                <Route path='/signin' element={<Signin />}>

                </Route>
                <Route path='/signup' element={<Signup />}>

                </Route>
              </Route>

            </Route>

            <Route path='/zail' element={<p>zail</p>}>

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
