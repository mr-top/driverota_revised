import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import { getClassroom } from "../../awConfig";

import SettingsPersonal from "./SettingsPersonal";
import SettingsAccount from "./SettingsAccount";
import SettingsStudent from "./SettingsStudent";
import SettingsInstructor from "./SettingsInstructor";

function SettingsProfile() {
  const { fetchedProfile } = useOutletContext();
  const [classroom, setClassroom] = useState({ fetched: false });

  useEffect(() => {
    fetchClassroom();
  }, []);

  async function fetchClassroom() {
    setClassroom({ fetched: false });
    const result = await getClassroom(fetchedProfile);

    console.log(result);

    if (result.success) {
      setClassroom({ fetched: true, found: true, ...result.classroom })
    } else {
      setClassroom({ fetched: true, found: false });
    }
  }

  return (
    <div className="px-10 space-y-5">
      <SettingsPersonal fetchedProfile={fetchedProfile} />

      <SettingsAccount fetchedProfile={fetchedProfile} />

      {classroom.fetched ? (classroom.found ? (fetchedProfile.student ?
        <SettingsStudent key={classroom.$id} classroom={classroom} fetchedProfile={fetchedProfile} fetchClassroom={fetchClassroom}/> :
        <SettingsInstructor classroom={classroom} />)
        :
        <p>Classroom not found</p>)
        :
        <span className="loading loading-spinner loading-md"></span>}
    </div>
  )
}

export default SettingsProfile;