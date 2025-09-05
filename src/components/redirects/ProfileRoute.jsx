import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { getProfile } from "../../awConfig";

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

    console.log(result);

    setFetchedProfile({ fetched: true, logged: result.success, ...(result.profile || {}) });
  }

  return (
    fetchedProfile.fetched ?
      <Outlet context={{ fetchedProfile }}/> :
      <span className="loading loading-spinner loading-md"></span>
  )
}

export default ProfileRoute;