import { createContext } from "react";

const ProfileContext = createContext();

function ProfileProvider({children}) {
  return (
    <ProfileContext.Provider value={{test: 'works!'}}>
      {children}
    </ProfileContext.Provider>
  )
}

export {ProfileContext, ProfileProvider}