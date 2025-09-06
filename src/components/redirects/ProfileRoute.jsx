import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { getProfile, getSession } from "../../awConfig";

function ProfileRoute({localProfile}) {
  const [fetchedProfile, setFetchedProfile] = useState({ fetched: false });

  useEffect(() => {
    if (localProfile.logged) {
      fetchProfile(localProfile.id);
    } else {
      setFetchedProfile({fetched: true, logged: false});
    }
  }, []);

  async function fetchProfile(userId) {
    const result = await getProfile(userId);

    const sessionResult = await getSession();

    setFetchedProfile({ fetched: true, logged: result.success && sessionResult.success, ...(result.success && sessionResult.success ? result.profile : {}) });
  }

  return (
    fetchedProfile.fetched ?
      <Outlet context={{ fetchedProfile }}/> :
      <span className="loading loading-spinner loading-md"></span>
  )
}

export default ProfileRoute;