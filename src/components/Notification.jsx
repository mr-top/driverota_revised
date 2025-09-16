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

  const [inPast, setInPast] = useState(isPast(notification.expiry || new Date()));
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (notification.timer) {
      if (!inPast) {
        const milliseconds = differenceInMilliseconds(notification.expiry, new Date());

        for (let percentage = 0; percentage <= 300; percentage++) {
          setTimeout(() => {
            setCountdown(percentage);
            if (percentage === 300) {
              setInPast(true);
            }
          }, (milliseconds / 300) * percentage)
        }
      }
    }
  }, []);


  function toggle () {
    toggleNotification(notification.id, false);
  }

  useEffect(() => {
    if (inPast) {
      toggle();
    }
  }, [inPast]);

  useEffect(() => {
    setDisplay(notification.display);
  }, [notification])

  return (
    <div onClick={toggle} className={`${(display && !inPast) || 'hidden'} ${getColour(notification.state)} flex flex-col justify-between h-12 hover:h-20 rounded-md overflow-hidden w-50`}>
      <div className="flex-1 overflow-hidden p-2">
        <p className="text-sm">{notification.msg}</p>
        <p className="opacity-80 text-xs">{notification.subMsg}</p>
      </div>
      <progress className="flex-initial h-1 opacity-40 progress w-full" value={countdown} max={300}></progress>
    </div>
  )
}

export default Notification;