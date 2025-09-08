import { useOutletContext } from "react-router-dom";

function SettingsWeb() {
  const { fetchedProfile } = useOutletContext();

  return (
    <div className="px-10">
      <div>
        <label htmlFor="" className="text-sm opacity-70">Theme:</label>
        <select defaultValue="dark" className="select">
          <option value={'dark'}>Dark</option>
          <option value={'light'}>Light</option>
        </select>
      </div>
    </div>
  )
}

export default SettingsWeb;