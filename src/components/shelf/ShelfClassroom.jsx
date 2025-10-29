import { Outlet, NavLink, useOutletContext } from "react-router-dom";

function ShelfClassroom () {
  const { fetchedProfile, meetings, classroom, fetchClassroom } = useOutletContext();

  return (
      <div className="flex justify-around w-full max-w-150 px-10 min-w-100 h-fit divide-x divide-base-content">
        <div className="flex-1 flex flex-col space-y-3">
        <NavLink to='/shelf/classroom/details' className={({ isActive }) => `w-30 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Details</NavLink>
          <div className="flex flex-col py-4 space-y-3">
          {fetchedProfile.student ?
            <>

            </> :
            <>
              <NavLink to='/shelf/classroom/pending' className={({ isActive }) => `w-35 btn btn-secondary ${isActive ? '' : 'btn-soft'}`}>Pending join requests</NavLink>
            </>
          }
          </div>
        </div>
        <Outlet context={{classroom, fetchClassroom}}/>
      </div>
    )
}

export default ShelfClassroom;