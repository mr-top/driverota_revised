import { useState, useReducer, useEffect, useContext } from "react";

import { NotificationContext } from "../../context/NotificationContext";

import { updatePersonal } from "../../awConfig";

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducer(state, action) {
  switch (action.type) {
    case 'content':
      return { ...state, changed: action.payload !== state.prevContent, saved: false, content: action.payload }
    case 'save':
      return { ...state, changed: !action.payload, saved: action.payload, prevContent: state.content }
  }
}

function SettingsPersonal({ fetchedProfile }) {
  const { addNotification } = useContext(NotificationContext);

  const [changed, setChanged] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, dispatchName] = useReducer(reducer, {
    content: fetchedProfile.name,
    prevContent: fetchedProfile.name,
    changed: false,
    saved: false
  });

  useEffect(() => {
    if (name.changed) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [name]);

  useEffect(() => {
    if (changed) {
      setSaved(false);
    }
  }, [changed])

  async function savePersonal() {
    setLoading(true);

    if (changed) {
      const result = await updatePersonal(fetchedProfile.$id, name);

      if (name.changed) {
        addNotification({ display: true, state: result.nameChanged ? 'success' : 'error', msg: result.nameChanged ? 'Name was changed' : 'Name was not changed', subMsg: result.msg, timer: true, seconds: 15 });
      }

      if (result.success) {
        setSaved(true);
        dispatchName({ type: 'save', payload: true });
      }
    }

    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center space-x-2">
        <p>Personal information</p>
        {changed && <DocumentArrowUpIcon className="size-4" />}
        {saved && <DocumentCheckIcon className="size-4" />}
      </div>
      <div>
        <label htmlFor="" className="text-sm opacity-70">Name:</label>
        <input type="text" className="input" value={name.content} onChange={e => dispatchName({ type: 'content', payload: e.currentTarget.value })} />
      </div>
      <div className="mt-5">
        <button className="btn btn-primary" onClick={savePersonal} disabled={!changed || loading}>
          {loading ? <span className="loading loading-spinner loading-md"></span> : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default SettingsPersonal;