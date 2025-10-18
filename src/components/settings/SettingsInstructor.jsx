import { useState, useReducer, useEffect, useContext } from "react";

import { updateClassroomImage, updateClassroomName, getClassroomImage } from "../../awConfig";

import { NotificationContext } from "../../context/NotificationContext";

import anonymous from '../../assets/anonymous.webp';

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducer(state, action) {
  switch (action.type) {
    case 'image':
      const url = URL.createObjectURL(action.payload);

      console.log(url);

      return { ...state, changed: action.payload !== state.prevContent, saved: false, content: action.payload, url }
    case 'url':
      return { ...state, url: action.payload }
    case 'name':
      return { ...state, changed: action.payload !== state.prevContent, saved: false, content: action.payload }
    case 'save':
      return { ...state, changed: !action.payload, saved: action.payload, prevContent: state.content }
  }
}

function SettingsInstructor({ classroom }) {
  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

  const [changed, setChanged] = useState(false);
  const [saved, setSaved] = useState(false);

  const [image, dispatchImage] = useReducer(reducer, {
    content: anonymous,
    prevContent: anonymous,
    url: anonymous,
    changed: false,
    saved: false
  });

  const [name, dispatchName] = useReducer(reducer, {
    content: classroom.name,
    prevContent: classroom.name,
    changed: false,
    saved: false
  });

  useEffect(() => {
    async function fetchImage() {
      if (classroom.pictureId) {
        const result = await getClassroomImage(classroom.pictureId);

        if (result.success) {
          dispatchImage({ type: 'url', payload: result.image });
        }
      }
    }

    fetchImage();
  }, []);

  useEffect(() => {
    if (image.changed || name.changed) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [image, name]);

  useEffect(() => {
    if (changed) {
      setSaved(false);
    }
  }, [changed]);

  function onFileInputChange(e) {
    const newFile = e.currentTarget.files[0];

    dispatchImage({ type: 'image', payload: newFile });
  }

  async function saveClassroom() {
    setLoading(true);

    try {
      if (changed) {

        if (name.changed) {
          const result = await updateClassroomName(classroom.$id, name.content);

          if (result.success) {
            dispatchName({ type: 'save', payload: true });
            addNotification({ display: true, state: 'success', msg: 'Success!', subMsg: 'Classroom name was changed', timer: true, seconds: 15 });
          } else {
            throw Error(result.msg);
          }
        }

        if (image.changed) {
          const result = await updateClassroomImage(classroom.$id, image.content);

          if (result.success) {
            dispatchImage({ type: 'save', payload: true });
            addNotification({ display: true, state: 'success', msg: 'Success!', subMsg: 'Classroom image was changed', timer: true, seconds: 15 });
          } else {
            throw Error(result.msg);
          }
        }

        setSaved(true);
      }
    } catch (error) {
      addNotification({ display: true, state: 'error', msg: 'Error!', subMsg: error.message, timer: true, seconds: 15 });
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        <p>Classroom (instructor)</p>
        {changed && <DocumentArrowUpIcon className="size-4" />}
        {saved && <DocumentCheckIcon className="size-4" />}
      </div>
      <div className="flex flex-col space-y-2">
        <div>
          <label htmlFor="settings_instructor_name" className="text-sm opacity-70">Name:</label>
          <input id='settings_instructor_name' type="text" className="input" value={name.content} onChange={e => dispatchName({ type: 'name', payload: e.currentTarget.value })} />
        </div>
        <div>
          <label htmlFor="settings_instructor_pic" className="text-sm opacity-70">Picture:</label>
          <div className="flex justify-between items-center space-x-2">
            <div className="flex-initial size-12 rounded-full border-[0.5px] border-black overflow-hidden">
              <img src={image.url} className="object-cover h-full" alt="" />
            </div>
            <input id='settings_instructor_pic' type="file" className="file-input max-w-60" onChange={onFileInputChange} />
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" onClick={saveClassroom} disabled={!changed || loading}>Save</button>
      </div>
    </div>
  )
}

export default SettingsInstructor;