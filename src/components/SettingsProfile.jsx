import { useOutletContext } from "react-router-dom";

function SettingsProfile () {
  const {fetchedProfile} = useOutletContext();
  
  return (
    <p>Profile</p>
  )
}

export default SettingsProfile;