import { useState, useEffect } from "react";
import { useOutletContext, Outlet, useNavigate } from "react-router-dom"

import ShelfPending from "../shelf/ShelfPending";

import { getClassroom } from "../../awConfig";

function ClassroomRoute() {
  const navigate = useNavigate();
  const { fetchedProfile } = useOutletContext();

  const [classroom, setClassroom] = useState({ fetched: false });

  useEffect(() => {
    fetchClassroom();
  }, []);

  async function fetchClassroom() {
    const result = await getClassroom(fetchedProfile);

    if (result.success) {
      const classroom = result.classroom;

      const allowed = classroom.instructorId === fetchedProfile.$id || classroom.students.includes(fetchedProfile.$id);

      setClassroom({ fetched: true, allowed, ...classroom });
    } else {
      navigate('/noclassroom');
    }
  }

  return (
    classroom.fetched ?
      (classroom.allowed ?
        <Outlet context={{ classroom }} /> :
        <ShelfPending classroom={classroom} />) :
      <span className="loading loading-spinner loading-md"></span>
  )
}

export default ClassroomRoute;