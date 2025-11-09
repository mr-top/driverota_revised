import { useReducer, useEffect, useState, useContext } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

import { format } from "date-fns";

import { cancelBooking } from "../../awConfig";

import { NotificationContext } from "../../context/NotificationContext";

import { CheckIcon } from "@heroicons/react/24/outline";

function reducerCurrent(state, action) {
  switch (action.type) {
    case 'recipient': {
      const meeting = '...';
      const date = '...';
      const duration = '...';
      const recipient = action.payload;
      const availableMeetings = {};

      state.givenMeetings.forEach(meeting => {
        const startDate = format(meeting.startTime, 'yyyy-MM-dd');

        if (state.isStudent ? (recipient === meeting.instructorId && meeting.studentId === state.fetchedProfile.$id) : (recipient === meeting.studentId)) {
          if (availableMeetings[startDate]) {
            availableMeetings[startDate].push(meeting);
          } else {
            availableMeetings[startDate] = [meeting];
          }
        }
      });

      const availableDates = Object.keys(availableMeetings);

      return { ...state, availableMeetings, availableDates, recipient, meeting, date, duration }
    }
    case 'date': {
      const meeting = '...';
      const duration = '...';
      const date = action.payload;

      return { ...state, date, meeting, duration }
    }
    case 'meeting': {
      const meetingId = action.payload;
      const duration = state.availableMeetings[state.date].find(meeting => meeting.$id === meetingId).duration;

      return { ...state, meeting: meetingId, duration }
    }
    case 'meetings': {
      const givenMeetings = action.payload;
      return { ...state, givenMeetings }
    }
  }
}

function ActionCancel() {
  const location = useLocation();
  const { fetchedProfile, meetings, classroom, recipients, instructorPrefs, fetchMeetings } = useOutletContext();

  const { addNotification } = useContext(NotificationContext);

  const [currentFound, setCurrentFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const [current, dispatchCurrent] = useReducer(reducerCurrent, {
    recipient: '...',
    date: '...',
    meeting: '...',
    duration: '...',
    availableDates: [],
    availableMeetings: {},
    givenMeetings: meetings,
    isStudent: fetchedProfile.student,
    instructorPrefs,
    fetchedProfile
  });

  useEffect(() => {
    const foundMeeting = meetings.find(meeting => current.meeting === meeting.$id);

    if (foundMeeting) {
      setCurrentFound(true);
    } else {
      setCurrentFound(false);
    }
  }, [current.meeting]);

  useEffect(() => {
    if (meetings.length) {
      dispatchCurrent({ type: 'meetings', payload: meetings });

      if (location.state?.meeting) {
        const meeting = location.state?.meeting;
        window.history.replaceState({}, '');
        dispatchCurrent({ type: 'recipient', payload: fetchedProfile.student ? meeting.instructorId : meeting.studentId });
        dispatchCurrent({ type: 'date', payload: format(meeting.startTime, 'yyyy-MM-dd') });
        dispatchCurrent({ type: 'meeting', payload: meeting.$id });
      }
    }
  }, [meetings]);

  async function onSubmitClick() {
    setLoading(true);
    const foundMeeting = meetings.find(meeting => current.meeting === meeting.$id);

    if (foundMeeting) {
      const result = await cancelBooking(foundMeeting.$id, fetchedProfile.$id);

      if (result.success) {
        await fetchMeetings();
        addNotification({ display: true, state: 'success', msg: 'Success!', subMsg: result.msg, timer: true, seconds: 10 });
      } else {
        addNotification({ display: true, state: 'error', msg: 'Failed!', subMsg: result.msg, timer: true, seconds: 10 });
      }
    };
    setLoading(false);
  }

  return (
    <div className="flex-1 flex flex-col items-center space-y-4">
      <div className="flex-1 flex flex-col w-50">
        <div className="flex items-center space-x-2">
          <p>Former</p>
          {currentFound && <div>
            <CheckIcon className='size-4' />
          </div>}
        </div>
        <div>
          <label htmlFor="action_cancel_recipient" className="text-sm opacity-70">{fetchedProfile.student ? 'Instructor' : 'Student'}:</label>
          <select id="action_cancel_recipient" className="select" value={current.recipient} onChange={e => dispatchCurrent({ type: 'recipient', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {recipients.map(recipient => <option value={recipient.$id} key={recipient.$id}>
              {recipient.name}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_cancel_duration" className="text-sm opacity-70">Duration:</label>
          <select id="action_cancel_duration" className="select" value={current.duration} onChange={e => { }}>
            <option value={'...'} disabled>...</option>
            {current.duration !== '...' && <option>
              {current.duration} minutes
            </option>}
          </select>
        </div>
        <div>
          <label htmlFor="action_cancel_scheduled_date" className="text-sm opacity-70">Scheduled date:</label>
          <select id="action_cancel_scheduled_date" className="select" value={current.date} onChange={e => dispatchCurrent({ type: 'date', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {current.availableDates.map(date => <option value={date} key={date}>
              {date}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_cancel_time" className="text-sm opacity-70">Scheduled time:</label>
          <select id="action_cancel_time" className="select" value={current.meeting} onChange={e => dispatchCurrent({ type: 'meeting', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {current.availableMeetings[current.date]?.map(meeting => <option value={meeting.$id} key={meeting.$id}>
              {format(meeting.startTime, 'HH:mm')} - {format(meeting.endTime, 'HH:mm')}
            </option>)}
          </select>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" disabled={!currentFound || loading} onClick={onSubmitClick}>Submit</button>
      </div>
    </div>
  )
}

export default ActionCancel;