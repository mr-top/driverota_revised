import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { NotifcationProvider } from './context/NotificationContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotifcationProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </NotifcationProvider>
  </StrictMode>,
)
