import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ping } from './awConfig.js';

import { NotificationContext } from './context/NotificationContext.jsx';
import { ProfileContext } from './context/ProfileContext.jsx';

import { ID } from 'appwrite';

import Nav from './components/navigation/Nav.jsx';
import ProfileRoute from './components/redirects/ProfileRoute.jsx';
import ProtectedRoute from './components/redirects/ProtectedRoute.jsx';
import ClassroomRoute from './components/redirects/ClassroomRoute.jsx';
import GuestRoute from './components/redirects/GuestRoute.jsx';
import MainLayout from './components/MainLayout.jsx';
import Signin from './components/Signin.jsx';
import Signup from './components/Signup.jsx';
import About from './components/About.jsx';
import Notifications from './components/Notifications.jsx';
import Settings from './components/Settings.jsx';
import SettingsProfile from './components/SettingsProfile.jsx';
import SettingsPrivacy from './components/SettingsPrivacy.jsx';
import SettingsWeb from './components/SettingsWeb.jsx';

function App() {
  const { localProfile, logout, login } = useContext(ProfileContext);
  const { notifications, addNotification, toggleNotification, removeNotification } = useContext(NotificationContext);

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
        <Nav localProfile={localProfile} />
        <Notifications />
        <Routes>
          <Route path='/' element={<MainLayout />}>

            <Route element={<ProfileRoute localProfile={localProfile} logout={logout} />}>

              <Route element={<ProtectedRoute logout={logout} />}>
                <Route element={<ClassroomRoute />}>
                  <Route path='/protected' element={<p>protected</p>} />
                </Route>
                <Route path='/noclassroom' element={<p>Sorry no classroom!</p>} />
                <Route element={<Settings/>}>
                  <Route path='/settings/profile' element={<SettingsProfile/>}/>
                  <Route path='/settings/privacy' element={<SettingsPrivacy/>}/>
                  <Route path='/settings/web' element={<SettingsWeb/>}/>
                  <Route path='/settings/*' element={<Navigate to={'/settings/profile'}/>}/>
                </Route>
              </Route>

              <Route element={<GuestRoute login={login} />}>
                <Route path='/signin' element={<Signin />}>

                </Route>
                <Route path='/signup' element={<Signup />}>

                </Route>
              </Route>

            </Route>

            <Route path='/about' element={<About />}>

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
