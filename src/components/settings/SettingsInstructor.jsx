import { useReducer, useEffect } from "react";

import anonymous from '../../assets/anonymous.webp';

function reducerImage(state, action) {
  switch (action.type) {
    case 'content':
      const newImage = URL.createObjectURL(action.payload);

      return { ...state, changed: action.payload !== state.prevContent, saved: false, name: action.payload?.name, content: newImage }
    case 'save':
      return { ...state, changed: !action.payload, saved: action.payload, prevContent: state.content }
  }
}

function SettingsInstructor() {
  const [image, dispatchImage] = useReducer(reducerImage, {
    content: anonymous,
    prevContent: anonymous,
    changed: false,
    saved: false
  });

  useEffect(() => {
    console.log(image);
  }, [image])

  function onInputChange(e) {
    const newFile = e.currentTarget.files[0];

    dispatchImage({ type: 'content', payload: newFile });
  }

  return (
    <div>
      <div className="flex items-center space-x-2">
        <p>Classroom (instructor)</p>
      </div>
      <div>
        <label htmlFor="" className="text-sm opacity-70">Picture:</label>
        <div className="flex justify-between items-center space-x-2">
          <div className="flex-initial size-12 rounded-full border-[0.5px] border-black overflow-hidden">
            <img src={image.content} className="object-cover h-full" alt="" />
          </div>
          <input type="file" className="file-input max-w-60" onChange={onInputChange} />
        </div>
      </div>
    </div>
  )
}

export default SettingsInstructor;