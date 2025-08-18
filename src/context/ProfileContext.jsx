import { createContext, useState, useEffect, useContext } from "react";
import { ID } from "appwrite";

const ProfileContext = createContext();

import { deleteSession, createSession } from "../awConfig";

import { NotificationContext } from "./NotificationContext";

function ProfileProvider({children}) {
  // profile format {logged: true, id: userID, email: userEmail}
  const [profile, setProfile] = useState(JSON.parse(localStorage.getItem('profile')) || {logged: false});

  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile])

  async function logout () {
    const result = await deleteSession();

    if (result.success) {
      setProfile({});
    } else {
      addNotification({id: ID.unique(), display: true, state: 'error', msg: 'Could not be logged out', subMsg: result.msg});
    }
  }

  async function login (email, password) {
    const result = await createSession(email, password);

    if (result.success) {
      setProfile(result.profile);
    } else {
      addNotification({id: ID.unique(), display: true, state: 'error', msg: 'Could not be logged in', subMsg: result.msg});
    }
  }

  return (
    <ProfileContext.Provider value={{logout, login}}>
      {children}
    </ProfileContext.Provider>
  )
}

export {ProfileContext, ProfileProvider}