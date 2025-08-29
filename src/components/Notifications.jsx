import { useContext } from "react";

import { NotificationContext } from "../context/NotificationContext";

import Notification from "./Notification";

function Notifications () {
  const { notifications, addNotification, toggleNotification, removeNotification } = useContext(NotificationContext);

  return (
    <div className="fixed top-20 right-5 z-1 space-y-2">
      {
        notifications.map(notification => <Notification key={notification.id} notification={notification} toggleNotification={toggleNotification}/>)
      }
    </div>
  )
}

export default Notifications;