import { useState, useReducer, useEffect, useContext } from "react";

import { NotificationContext } from "../../context/NotificationContext";

import { lookupClassroom, changeClassroom } from "../../awConfig";

import SettingsClassroomConfirmModal from "./SettingsClassroomConfirmModal";

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducer(state, action) {
  switch (action.type) {
    case 'content':
      return { ...state, changed: action.payload !== state.prevContent, saved: false, content: action.payload }
    case 'save':
      return { ...state, changed: !action.payload, saved: action.payload, prevContent: state.content }
  }
}

function SettingsStudent({ classroom, fetchedProfile, fetchClassroom }) {
  const { addNotification } = useContext(NotificationContext);

  const [classroomId, dispatchClassroomId] = useReducer(reducer, {
    content: classroom.instructorCode,
    prevContent: classroom.instructorCode,
    changed: false,
    saved: false
  });

  const [newClassroom, setNewClassroom] = useState();

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

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

  async function submitClassroomLookup() {
    setLoading(true);

    if (classroomId.changed) {
      const result = await lookupClassroom(classroomId.content);

      if (result.success) {
        setNewClassroom(result.classroom);
        document.getElementById('settings_student_classroom_confirm_modal').showModal();
      } else {
        addNotification({ display: true, state: 'error', msg: 'Error!', subMsg: result.msg, timer: true, seconds: 15 });
      }
    }

    setLoading(false);
  }

  async function submitClassroomChange() {
    setModalLoading(true);

    if (newClassroom) {
      const result = await changeClassroom(fetchedProfile.$id, classroom.$id, newClassroom.$id);

      document.getElementById('settings_student_classroom_confirm_modal').close();

      if (result.success) {
        addNotification({ display: true, state: 'success', msg: 'Success!', subMsg: result.msg, timer: true, seconds: 15 });
        await fetchClassroom();
      } else {
        addNotification({ display: true, state: 'error', msg: 'Error!', subMsg: result.msg, timer: true, seconds: 15 });
      }
    }

    setModalLoading(false);
  }

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
        <button className="btn btn-primary" disabled={!changed || loading} onClick={submitClassroomLookup}>Save</button>
      </div>
      <SettingsClassroomConfirmModal classroom={newClassroom} submitClassroomChange={submitClassroomChange} modalLoading={modalLoading} />
    </div>
  )
}

export default SettingsStudent;