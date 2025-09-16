import { useOutletContext } from "react-router-dom";

import SettingsPersonal from "./SettingsPersonal";
import SettingsAccount from "./SettingsAccount";

function SettingsProfile() {
  const { fetchedProfile } = useOutletContext();

  return (
    <div className="px-10 space-y-5">
      <SettingsPersonal fetchedProfile={fetchedProfile}/>

      <SettingsAccount fetchedProfile={fetchedProfile}/>
    </div>
  )
}

export default SettingsProfile;