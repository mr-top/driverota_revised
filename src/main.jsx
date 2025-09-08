import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { NotificationProvider } from './context/NotificationContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
)
