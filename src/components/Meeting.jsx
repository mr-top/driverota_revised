import { useState, useEffect } from "react";

import { format } from "date-fns";

import { getProfile, getProfileImage } from "../awConfig";

import anonymous from '../assets/anonymous.webp';
import MeetingDropdown from "./MeetingDropdown";

function Meeting({ meeting, fetchedProfile}) {
  const [image, setImage] = useState(anonymous);
  const [profile, setProfile] = useState({ fetched: false });

  useEffect(() => {
    fetchProfile();
    fetchProfileImage();

    console.log(fetchedProfile);
  }, []);

  async function fetchProfile() {
    const result = await getProfile(meeting.studentId);

    if (result.success) {
      setProfile({ fetched: true, ...result.profile });
    }
  }

  async function fetchProfileImage() {
    const result = await getProfileImage(meeting.studentId);

    if (result.success) {
      setImage(result.image);
    }
  }

  return (
    profile.fetched ?
      <li className="flex items-center justify-between px-4 py-2 h-20 space-x-4 group rounded-xl bg-base-100">
        <img
          src={image}
          alt=""
          className="flex-none size-10 rounded-full"
        />
        <div className="flex-auto">
          <div className='flex flex-col'>
            <p className='text-base-content text-base/3'>{profile.name}</p>
            <p className="text-base-content text-sm opacity-70">{meeting.name}</p>
          </div>
          <p className="mt-0.5 opacity-70">
            <time dateTime={meeting.startTime}>
              {format(meeting.startTime, 'h:mm a')}
            </time>{' '}
            -{' '}
            <time dateTime={meeting.endTime}>
              {format(meeting.endTime, 'h:mm a')}
            </time>
          </p>
        </div>
        <MeetingDropdown meeting={meeting} fetchedProfile={fetchedProfile}/>
      </li> :
      <div className="skeleton h-20 w-full"></div>
  )
}

export default Meeting;