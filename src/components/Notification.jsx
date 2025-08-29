import { useState, useEffect } from "react";
import { isPast, differenceInMilliseconds } from "date-fns";

function getColour(state) {
  switch (state) {
    case 'error':
      return 'bg-error hover:bg-error/60 text-error-content';
    case 'success':
      return 'bg-success hover:bg-success/60 text-success-content';
    case 'warning':
      return 'bg-warning hover:bg-warning/60 text-warning-content';
    default:
      return 'bg-base-300 hover:bg-base-300/60 text-base-content';
  }
}

function Notification({ notification, toggleNotification }) {
  const [display, setDisplay] = useState(notification.display);
  const [past, setPast] = useState(isPast(notification.expiry));

  useEffect(() => {
    if (!past) {
      setTimeout(() => {
        setDisplay(false);
        toggleNotification(notification.id, false);
      }, differenceInMilliseconds(notification.expiry, new Date()));
    }
  }, []);

  function toggle () {
    setDisplay(false);
    toggleNotification(notification.id, false);
  }

  return (
    <div onClick={toggle} className={`${(display && !past) || 'hidden'} ${getColour(notification.state)} py-2 px-1 rounded-md w-50 h-12 hover:h-fit`}>
      <p className="text-xs">{notification.msg}</p>
    </div>
  )
}

export default Notification;