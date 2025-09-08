import { useState, useEffect } from "react";
import { useOutletContext, Outlet, useNavigate } from "react-router-dom"

import { getClassroom } from "../../awConfig";

function ClassroomRoute () {
  const navigate = useNavigate();
  const { fetchedProfile } = useOutletContext();

  const [ classroom, setClassroom ] = useState({fetched: false});

  useEffect(() => {
    console.log(fetchedProfile);

    fetchClassroom();
  }, []);

  async function fetchClassroom () {
    const result = await getClassroom(fetchedProfile);

    if (result.success) {
      setClassroom({fetched: true, ...result.classroom});
    } else {
      navigate('/noclassroom');
    }
  }

  return (
    classroom.fetched ?
      <Outlet context={{ classroom }}/> :
      <span className="loading loading-spinner loading-md"></span>
  )
}

export default ClassroomRoute;