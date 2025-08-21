import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { getProfile } from "../../awConfig";

function ProfileRoute() {
  const [fetchedProfile, setFetchedProfile] = useState({ fetched: false });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const result = await getProfile();

    setFetchedProfile({ fetched: true, logged: result.success, ...(result.profile || {}) });
  }

  return (
    fetchedProfile.fetched ?
      <Outlet context={{ fetchedProfile }}/> :
      <span className="loading loading-spinner loading-md"></span>
  )
}

export default ProfileRoute;