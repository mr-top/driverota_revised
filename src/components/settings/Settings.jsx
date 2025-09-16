import { useEffect } from "react";
import { Outlet, useOutletContext, NavLink } from "react-router-dom";

function Settings() {
  const { fetchedProfile } = useOutletContext();

  useEffect(() => {
    console.log(fetchedProfile);
  }, [])

  return (
    <div className="flex flex-col justify-start items-start space-y-5 py-5 px-10 max-w-150 w-screen min-h-100 bg-base-200 border-[0.5px] border-base-content rounded-md">
      <div role="tablist" className="tabs tabs-lift flex w-full">
        <NavLink role="tab" to='/settings/profile' className={({isActive}) => `flex-1 tab ${isActive && 'tab-active'}`}>Profile</NavLink>
        <NavLink role="tab" to='/settings/privacy' className={({isActive}) => `flex-1 tab ${isActive && 'tab-active'}`}>Privacy</NavLink>
        <NavLink role="tab" to='/settings/web' className={({isActive}) => `flex-1 tab ${isActive && 'tab-active'}`}>Web</NavLink>
      </div>
      <Outlet context={{fetchedProfile}}/>
    </div>
  )
}

export default Settings;