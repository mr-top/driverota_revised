import { useEffect, useState } from "react";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";

function Shelf() {
  const { classroom } = useOutletContext();

  const [classroomMeetings, setClassroomMeetings] = useState('');

  useEffect(() => {
    console.log(classroom);
  }, []);

  // async function fetchMeetings () {
  //   const result = await getMeetings()
  // }

  return (
    <div className="flex flex-col bg-base-200 w-full sm:mx-10">
      <div className="flex-initial flex justify-around items-center w-full h-16 tabs tabs-lift" role="tablist">
        <NavLink role="tab" to='/shelf/calendar' className={({ isActive }) => `tab ${isActive && 'tab-active'}`}>Calendar</NavLink>
        <NavLink role="tab" to='/shelf/actions' className={({ isActive }) => `tab ${isActive && 'tab-active'}`}>Action</NavLink>
        <NavLink role="tab" to='/shelf/classroom' className={({ isActive }) => `tab ${isActive && 'tab-active'}`}>Classroom</NavLink>
      </div>
      <div className="flex-1 flex justify-center items-center min-h-80">
        <Outlet />
      </div>
    </div>
  )
}

export default Shelf;