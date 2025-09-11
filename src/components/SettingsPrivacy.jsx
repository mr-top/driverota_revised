import { useReducer, useEffect, useState, use } from "react";
import { useOutletContext } from "react-router-dom";

import { updatePrivacy } from "../awConfig";

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducerLevels(state, action) {
  switch (action.type) {
    case 'level':
      return { ...state, changed: state.prevSave !== action.payload, level: action.payload }
    case 'save':
      return { ...state, saved: action.payload, prevSave: action.payload ? state.level : state.prevSave, changed: action.payload ? false : state.changed }
  }
}

function SettingsPrivacy() {
  const { fetchedProfile } = useOutletContext();

  useEffect(() => {
    console.log(fetchedProfile);
  }, [])

  const [toSave, setToSave] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notification, dispatchNotification] = useReducer(reducerLevels, {
    level: fetchedProfile.notificationPreference,
    prevSave: fetchedProfile.notificationPreference,
    changed: false,
    saved: false
  });

  const [newsletter, dispatchNewsletter] = useReducer(reducerLevels, {
    level: fetchedProfile.newsletterPreference,
    prevSave: fetchedProfile.newsletterPreference,
    changed: false,
    saved: false
  });

  useEffect(() => {
    if (notification.changed) {
      dispatchNotification({ type: 'save', payload: false });
    }
  }, [notification.changed]);

  useEffect(() => {
    if (newsletter.changed) {
      dispatchNewsletter({ type: 'save', payload: false });
    }
  }, [newsletter.changed]);

  useEffect(() => {
    if (notification.changed || newsletter.changed) {
      setToSave(true);
    } else {
      setToSave(false);
    }
  }, [notification, newsletter]);

  async function save() {
    setLoading(true);
    const result = await updatePrivacy(fetchedProfile.$id, notification, newsletter);

    console.log(result);

    if (result.notificationChanged) {
      dispatchNotification({ type: 'save', payload: true });
    }

    if (result.newsletterChanged) {
      dispatchNewsletter({ type: 'save', payload: true });
    }

    setLoading(false);
  }

  return (
    <div className="px-10 space-y-5">
      <div className="flex flex-col space-y-1">
        <label htmlFor="" className="flex items-center space-x-2 text-sm opacity-70">
          <p>Notification:</p>
          {notification.changed && <DocumentArrowUpIcon className="size-4"/>}
          {notification.saved && <DocumentCheckIcon className="size-4"/>}
        </label>
        <select defaultValue={notification.level} onChange={e => dispatchNotification({ type: 'level', payload: Number(e.currentTarget.value) })} className="select">
          <option value={0}>No notifications</option>
          <option value={1}>Notifications for changes to your schedule</option>
          <option value={2}>Notifications for changes to instructors calendar</option>
        </select>
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="" className="flex items-center space-x-2 text-sm opacity-70">
          <p>Newsletter:</p>
          {newsletter.changed && <DocumentArrowUpIcon className="size-4"/>}
          {newsletter.saved && <DocumentCheckIcon className="size-4"/>}
        </label>
        <select defaultValue={newsletter.level} onChange={e => dispatchNewsletter({ type: 'level', payload: Number(e.currentTarget.value) })} className="select">
          <option value={0}>No newsletter</option>
          <option value={1}>Newsletters concerning your data and rights</option>
          <option value={2}>Newsletters concerning your data and rights alongside product updates</option>
        </select>
      </div>
      <div>
        <button className="btn btn-primary" onClick={save} disabled={!toSave || loading}>
          {loading ? <span className="loading loading-spinner loading-md"></span> : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default SettingsPrivacy;