import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import { getClassroom } from "../../awConfig";

import SettingsPersonal from "./SettingsPersonal";
import SettingsAccount from "./SettingsAccount";
import SettingsStudent from "./SettingsStudent";
import SettingsInstructor from "./SettingsInstructor";
import ClassroomCard from "../ClassroomCard";

function SettingsProfile() {
  const { fetchedProfile } = useOutletContext();
  const [ classroom, setClassroom ] = useState({fetched: false});

  useEffect(() => {
    fetchClassroom();
  }, []);

  useEffect(() => {
    console.log(classroom);
  }, [classroom])

  async function fetchClassroom () {
    const result = await getClassroom(fetchedProfile);

    if (result.success) {
      setClassroom({fetched: true, found: true, ...result.classroom})
    } else {
      setClassroom({fetched: true, found: false});
    }
  }

  return (
    <div className="px-10 space-y-5">
      <SettingsPersonal fetchedProfile={fetchedProfile}/>

      <SettingsAccount fetchedProfile={fetchedProfile}/>

      { fetchedProfile.student ? 
        <SettingsStudent>
          <ClassroomCard classroom={classroom}/>
        </SettingsStudent> :
        <SettingsInstructor>
          <ClassroomCard classroom={classroom}/>
        </SettingsInstructor> }
    </div>
  )
}

export default SettingsProfile;