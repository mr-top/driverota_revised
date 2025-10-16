import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { getProfile, getSession } from "../../awConfig";

function ProfileRoute({ localProfile, logout }) {
  const [fetchedProfile, setFetchedProfile] = useState({ fetched: false });

  useEffect(() => {
    if (localProfile.logged) {
      fetchProfile(localProfile.id);
    } else {
      setFetchedProfile({ fetched: true, logged: false });
    }
  }, []);

  async function fetchProfile(userId) {
    // fetch the existence of the profile, and also get the current session
    const result = await getProfile(userId);

    const sessionResult = await getSession();

    if (!sessionResult.success || sessionResult.session?.userId !== result.profile?.$id) {
      // if there isn't session or session user id and fetched profile id does not match, log out
      await logout();
    }

    // user must exist and there must be a cloud logged session to be logged. Session user id and fetched profile id must also match
    const logged = result.success && sessionResult.success && (result.profile.$id === sessionResult.session.userId);

    setFetchedProfile({ fetched: true, logged, ...(logged ? result.profile : {}) });
  }

  return (
    fetchedProfile.fetched ?
      <Outlet context={{ fetchedProfile }} /> :
      <span className="loading loading-spinner loading-md"></span>
  )
}

export default ProfileRoute;