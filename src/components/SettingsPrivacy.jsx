import { useOutletContext } from "react-router-dom";

function SettingsPrivacy () {
  const {fetchedProfile} = useOutletContext();
  
  return (
    <div>
      <div>
        <label htmlFor="">Theme</label>
      </div>
    </div>
  )
}

export default SettingsPrivacy;