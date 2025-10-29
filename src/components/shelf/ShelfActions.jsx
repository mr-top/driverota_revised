import { useState, useEffect } from "react";
import { Outlet, NavLink, useOutletContext } from "react-router-dom";

import { getPeople } from "../../awConfig";

function ShelfActions() {
  const { fetchedProfile, meetings, classroom } = useOutletContext();

  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    fetchRecipients();
  }, []);

  async function fetchRecipients() {
    const result = await getPeople(fetchedProfile.student ? [classroom.instructorId] : classroom.students);

    if (result.success) {
      setRecipients(result.people);
    }
  }

  return (
    <div className="flex justify-around w-full max-w-150 px-10 min-w-100 h-fit divide-x divide-base-content">
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
      <Outlet context={{ fetchedProfile, meetings, classroom, recipients }} />
    </div>
  )
}

export default ShelfActions;