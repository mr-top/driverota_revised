import { useState, useReducer, useEffect } from "react";

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducer(state, action) {
  switch (action.type) {
    case 'content':
      return { ...state, changed: action.payload !== state.prevContent, saved: false, content: action.payload }
    case 'save':
      return { ...state, changed: !action.payload, saved: action.payload, prevContent: state.content }
  }
}

function SettingsStudent({ classroom, fetchedProfile }) {
  const [classroomId, dispatchClassroomId] = useReducer(reducer, {
    content: classroom.instructorCode,
    prevContent: classroom.instructorCode,
    changed: false,
    saved: false
  });

  const [changed, setChanged] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
      if (classroomId.changed) {
        setChanged(true);
      } else {
        setChanged(false);
      }
    }, [classroomId]);
  
    useEffect(() => {
      if (changed) {
        setSaved(false);
      }
    }, [changed]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <p>Classroom (student)</p>
        {changed && <DocumentArrowUpIcon className="size-4" />}
        {saved && <DocumentCheckIcon className="size-4" />}
      </div>
      <div className="flex flex-col space-y-2">
        {
          (!classroom.students.includes(fetchedProfile.$id) && classroom.jstudents.includes(fetchedProfile.$id)) &&
          <div>
            <p>Your request to join this classroom is pending</p>
          </div>
        }
        <div>
          <label htmlFor="">Classroom ID</label>
          <input type="text" className="input" value={classroomId.content} onChange={e => dispatchClassroomId({ type: 'content', payload: e.currentTarget.value })} />
        </div>
      </div>
      <div>
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  )
}

export default SettingsStudent;