import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { getProfile } from "../awConfig";

function MainLayout() {
  const [fetchedProfile, setFetchedProfile] = useState({ fetched: false });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const result = await getProfile();

    if (result.success) {
      setFetchedProfile({ fetched: true, ...result.profile });
    }
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      {fetchProfile.fetched ?
        <Outlet context={{ fetchedProfile }} /> :
        <div className="flex justify-center items-center">
          <div>
            <span className="loading loading-spinner loading-md"></span>
          </div>
        </div>
      }
    </div>
  )
}

export default MainLayout;