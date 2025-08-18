import { createContext, useState, useEffect } from "react";

const NotificationContext = createContext();

function NotificationProvider({children}) {
  // notification format {id: 'xxx', display: true, state: 'error', msg: 'This failed because X'}
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem('notifications')) || []);
  
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  function addNotification(notification) {
    setNotifications(prev => [...prev, notification]);
  }

  function toggleNotification(notificationId) {
    setNotifications(prev => {
      const prevCopy = JSON.parse(JSON.stringify(prev));
      const foundNotif = prevCopy.find(notification => notification.id === notificationId);

      foundNotif.display = !foundNotif.display;
      return prevCopy;
    })
  }

  function removeNotification(notificationId) {
    setNotifications(prev => {
      const prevCopy = JSON.parse(JSON.stringify(prev));
      const foundNotifIndex = prevCopy.findIndex(notification => notification.id === notificationId);

      prevCopy.splice(foundNotifIndex, 1);
      return prevCopy;
    })
  }

  return (
    <NotificationContext.Provider value={{notifications, addNotification, toggleNotification, removeNotification}}>
      {children}
    </NotificationContext.Provider>
  )
}

export {NotificationContext, NotificationProvider}