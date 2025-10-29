import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import { getPeople, updateJstudent } from "../../awConfig";

import { CheckIcon } from "@heroicons/react/24/outline";

function ClassroomPending() {
  const { classroom } = useOutletContext();

  const [jstudents, setJstudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJstudents();
  }, [classroom]);

  async function fetchJstudents() {
    const result = await getPeople(classroom.jstudents);

    if (result.success) {
      setJstudents(result.people);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center space-y-2">
      <div className="w-50">
        <label htmlFor="classroom_pending_search" className="text-sm opacity-70">Search:</label>
        <input id="classroom_pending_search" type="text" className="input" placeholder="email address or name..." onChange={e => setSearch(e.currentTarget.value)} />
      </div>
      <div className="flex flex-col w-60 h-80 rounded-md overflow-y-auto bg-base-300">
        {jstudents.filter(jstudent => jstudent.name.includes(search) || jstudent.email.includes(search))
          .map(jstudent => <Jstudentcard jstudent={jstudent} classroom={classroom}/>)}
      </div>
    </div>
  )
}

function Jstudentcard({jstudent, classroom}) {
  const { fetchClassroom } = useOutletContext();
  const [loading, setLoading] = useState(false);

  async function acceptJstudent(jstudent) {
    setLoading(true);
    const result = await updateJstudent(jstudent.$id, classroom.$id);

    if (result.success) {
      await fetchClassroom();
    } else {
      setLoading(false);
    }
  }

  return (<div className="flex items-center w-full h-10 px-2" key={jstudent.$id}>
    <div className="flex-1 flex flex-col justify-center p-2">
      <p className="text-base">{jstudent.name}</p>
      <p className="text-sm/2 align-text-top opacity-80">{jstudent.email}</p>
    </div>
    <div className="flex-initial p-2">
      <button className="btn btn-success size-6 rounded-sm p-0" disabled={loading} onClick={e => acceptJstudent(jstudent)}>
        <CheckIcon className="size-5" />
      </button>
    </div>
  </div>)
}

export default ClassroomPending;