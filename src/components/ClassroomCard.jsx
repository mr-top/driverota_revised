import { useReducer, useEffect, useContext } from "react";

import { getProfile, getClassroomImage, updateClassroomImage } from "../awConfig";

import { NotificationContext } from '../context/NotificationContext';

import anonymous from '../assets/anonymous.webp';

function reducerImage (state, action) {
  switch (action.type) {
    case 'current':
      return {...state, current: action.payload}
    case 'file':
      return {...state, changed: true, file: action.payload}
    case 'save':
      return {...state, changed: false }
  }
}

function ClassroomCard({ classroom }) {
  const { addNotification } = useContext(NotificationContext);
  const [image, dispatchImage] = useReducer(reducerImage, {
    current: anonymous,
    changed: false,
    file: {}
  });

  useEffect(() => {
    if (classroom.fetched && classroom.found) {
      fetchClassroomImage();

      getInstructor();
    }
  }, [classroom]);

  async function getInstructor() {
    const result = await getProfile(classroom.instructorId);

    console.log(result);
  }

  async function fetchClassroomImage() {
    const result = await getClassroomImage(classroom.pictureId);

    if (result.success) {
      dispatchImage({type: 'current', payload: result.image});
    }
  }

  async function changeClassroomImage() {
    const result = await updateClassroomImage(classroom.$id, image.file);

    if (result.success) {
      dispatchImage({type: 'save', payload: true});
      addNotification({ display: true, state: 'success', msg: 'Picture changed', timer: true, seconds: 10 });
    } else {
      addNotification({ display: true, state: 'error', msg: result.msg, timer: true, seconds: 10 });
    }
  }

  function onInputChange(e) {
    const newFile = e.currentTarget.files[0];

    const newImage = URL.createObjectURL(newFile);

    dispatchImage({type: 'current', payload: newImage});
    dispatchImage({type: 'file', payload: newFile});
  }

  return (
    <div className="flex flex-col w-full min-w-60 h-20 rounded-md py-2 bg-base-300">
      <div className="flex">
        <input type='file' id='classroom_picture_input' className="hidden" onChange={onInputChange}></input>
        <div className="rounded-full border-[0.5px] border-black size-12 overflow-hidden"
          onClick={e => document.getElementById('classroom_picture_input').click()} id='classroom_picture'>
          <img src={image.current} alt="" className="object-cover h-full"/>
        </div>
        <div>
          <p>blah</p>
        </div>
      </div>
      {
        image.changed && <div className="flex items-center space-x-3">
          <p className="text-sm opacity-70">Change detected:</p>
          <button className="btn btn-xs btn-secondary rounded-full" onClick={changeClassroomImage}>Save</button>
        </div>
      }
    </div>
  )
}

export default ClassroomCard;