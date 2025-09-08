import { useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

function SettingsWeb() {
  const { fetchedProfile } = useOutletContext();
  const { getTheme, changeTheme } = useContext(ThemeContext);

  return (
    <div className="px-10">
      <div>
        <label htmlFor="" className="text-sm opacity-70">Theme:</label>
        <select defaultValue={getTheme()} onChange={e => changeTheme(e.currentTarget.value)} className="select">
          <option value={'dark'}>Dark</option>
          <option value={'light'}>Light</option>
        </select>
      </div>
    </div>
  )
}

export default SettingsWeb;