import { createContext, useState, useEffect, useContext } from "react";
import { ID } from "appwrite";

const ProfileContext = createContext();

import { deleteSession, createSession } from "../awConfig";

import { NotificationContext } from "./NotificationContext";

function ProfileProvider({ children }) {
  // profile format {logged: true, id: userID, email: userEmail}
  const [localProfile, setLocalProfile] = useState(JSON.parse(localStorage.getItem('profile')) || { logged: false });

  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(localProfile));
  }, [localProfile])

  async function logout() {
    const result = await deleteSession();

    if (result.success) {
      setLocalProfile({});
    } 

    return result;
  }

  async function login({ email, password }) {
    const result = await createSession(email, password);

    if (result.success) {
      setLocalProfile(result.profile);
    } 

    return result;
  }

  return (
    <ProfileContext.Provider value={{ logout, login, localProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export { ProfileContext, ProfileProvider }