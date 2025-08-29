import { createContext, useState, useEffect } from "react";
import { ID } from "appwrite";
import { add } from "date-fns";

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  // notification format {id: 'xxx', display: true, state: 'error', msg: 'This failed', subMsg: 'X did this to Y'}
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem('notifications')) || []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  function addNotification(notification) {
    if (!notification.id) {
      notification.id = ID.unique();
    }

    notification.expiry = add(new Date(), { seconds: notification.seconds })

    setNotifications(prev => [...prev, notification]);
  }

  function toggleNotification(notificationId, status) {
    setNotifications(prev => {
      const prevCopy = JSON.parse(JSON.stringify(prev));
      const foundNotif = prevCopy.find(notification => notification.id === notificationId);

      foundNotif.display = status;
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
    <NotificationContext.Provider value={{ notifications, addNotification, toggleNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export { NotificationContext, NotificationProvider }