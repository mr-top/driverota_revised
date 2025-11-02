import { useState, useEffect } from "react";
import { Outlet, NavLink, useOutletContext } from "react-router-dom";

import { getPeople, getPrefs } from "../../awConfig";

function ShelfActions() {
  const { fetchedProfile, meetings, classroom } = useOutletContext();

  const [recipients, setRecipients] = useState();
  const [instructorPrefs, setInstructorPrefs] = useState();

  useEffect(() => {
    fetchRecipients();
    fetchPrefs();
  }, []);

  async function fetchRecipients() {
    const result = await getPeople(fetchedProfile.student ? [classroom.instructorId] : classroom.students);

    if (result.success) {
      setRecipients(result.people);
    }
  }

  async function fetchPrefs() {
    const result = await getPrefs(classroom.$id);

    if (result.success) {
      const purePrefs = result.prefs.map(pref => {
        const schedule = JSON.parse(pref.schedule);
        const holidays = pref.holidays.map(holiday => JSON.parse(holiday));
        return {
          ...pref,
          schedule,
          holidays
        }
      });

      setInstructorPrefs(purePrefs);
    }
  }

  return (
    <div className="flex justify-around w-180 px-10 h-fit divide-x divide-base-content">
      <div className="flex-1 flex flex-col space-y-3">
        <NavLink to='/shelf/actions/schedule' className={({ isActive }) => `w-30 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Book</NavLink>
        <NavLink to='/shelf/actions/reschedule' className={({ isActive }) => `w-30 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Reschedule</NavLink>
        <NavLink to='/shelf/actions/cancel' className={({ isActive }) => `w-30 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Cancel</NavLink>
        <div className="flex flex-col py-4 space-y-3">
          {fetchedProfile.student ?
            <>
              <NavLink to='/shelf/actions/swap' className={({ isActive }) => `w-30 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Swap</NavLink>
            </> :
            <>
              <NavLink to='/shelf/actions/holiday' className={({ isActive }) => `w-35 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Book a holiday</NavLink>
              <NavLink to='/shelf/actions/holidaycancel' className={({ isActive }) => `w-35 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Cancel a holiday</NavLink>
            </>
          }
        </div>
      </div>
      {(recipients && instructorPrefs) ? <Outlet context={{ fetchedProfile, meetings, classroom, recipients, instructorPrefs }} />
        : <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
          </div>}
    </div>
  )
}

export default ShelfActions;