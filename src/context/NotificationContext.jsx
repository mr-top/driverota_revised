import { createContext } from "react";

const NotificationContext = createContext();

function NotifcationProvider({children}) {
  return (
    <NotificationContext.Provider value={{test: 'works!'}}>
      {children}
    </NotificationContext.Provider>
  )
}

export {NotificationContext, NotifcationProvider}