import { useReducer, useEffect, useState } from "react";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";

import { isPast, format, isSameDay, parse } from "date-fns";

import getTimeSlots from "../utils/getTimeSlots";
import getDateSlots from "../utils/getDateSlots";

import { CheckIcon } from "@heroicons/react/24/outline";

function reducerCurrent(state, action) {
  switch (action.type) {
    case 'recipient': {
      const meeting = '...';
      const date = '...';
      const duration = '...';
      const recipient = action.payload;
      const availableMeetings = [];
      const availableDates = [];
      state.givenMeetings.forEach(meeting => {
        const startDate = format(meeting.startTime, 'yyyy-MM-dd');
        if (!availableDates.includes(startDate) && recipient === (state.isStudent ? meeting.instructorId : meeting.studentId)) {
          availableDates.push(startDate);
        }
      });
      return { ...state, availableMeetings, availableDates, recipient, meeting, date, duration }
    }
    case 'date': {
      const meeting = '...';
      const duration = '...';
      const date = action.payload;
      const availableMeetings = [];
      state.givenMeetings.forEach(meeting => {
        const startDate = format(meeting.startTime, 'yyyy-MM-dd');
        if (startDate === date) {
          availableMeetings.push(meeting);
        }
      });
      return { ...state, availableMeetings, date, meeting, duration }
    }
    case 'meeting': {
      const meetingId = action.payload;
      const duration = state.givenMeetings.find(meeting => meeting.$id === meetingId).duration;

      return { ...state, meeting: meetingId, duration }
    }
    case 'meetings': {
      const givenMeetings = action.payload;
      return { ...state, givenMeetings }
    }
  }
}

function reducerProposal(state, action) {
  switch (action.type) {
    case 'recipient': {
      const meeting = '...';
      const date = '...';
      const duration = '...';
      const recipient = action.payload;
      const availableMeetings = [];
      const availableDates = [];

      const foundPref = state.instructorPrefs.find(pref => pref.$id === (state.fetchedProfile.student ? recipient : state.fetchedProfile.$id));

      const availableDurations = foundPref.duration;

      return { ...state, foundPref, availableMeetings, availableDates, availableDurations, recipient, meeting, date, duration }
    }
    case 'duration': {
      const meeting = '...';
      const date = '...';
      const availableMeetings = [];

      const duration = action.payload;

      const availableDates = getDateSlots(state, duration);

      return { ...state, duration, meeting, date, availableMeetings, availableDates }
    }
  }
}

function ActionReschedule() {
  const location = useLocation();
  const { fetchedProfile, meetings, classroom, recipients, instructorPrefs } = useOutletContext();

  const [currentFound, setCurrentFound] = useState(false);

  const [current, dispatchCurrent] = useReducer(reducerCurrent, {
    recipient: '...',
    date: '...',
    meeting: '...',
    duration: '...',
    availableDates: [],
    availableMeetings: [],
    givenMeetings: meetings,
    isStudent: fetchedProfile.student
  });

  const [proposal, dispatchProposal] = useReducer(reducerProposal, {
    recipient: '...',
    date: '...',
    meeting: '...',
    duration: '...',
    availableDates: [],
    availableMeetings: [],
    availableDurations: [],
    givenMeetings: meetings,
    isStudent: fetchedProfile.student,
    instructorPrefs,
    fetchedProfile
  });

  useEffect(() => {
    console.log(proposal);
  }, [proposal])

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

  return (
    <div className="flex-1 flex justify-center">
      <div className="flex-1 flex flex-col mx-4">
        <div className="flex items-center space-x-2">
          <p>Former</p>
          {currentFound && <div>
            <CheckIcon className='size-4' />
          </div>}
        </div>
        <div>
          <label htmlFor="action_reschedule_recipient" className="text-sm opacity-70">{fetchedProfile.student ? 'Instructor' : 'Student'}:</label>
          <select id="action_reschedule_recipient" className="select" value={current.recipient} onChange={e => dispatchCurrent({ type: 'recipient', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {recipients.map(recipient => <option value={recipient.$id} key={recipient.$id}>
              {recipient.name}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_reschedule_duration" className="text-sm opacity-70">Duration:</label>
          <select id="action_reschedule_duration" className="select" value={current.duration} onChange={e => {}}>
            <option value={'...'} disabled>...</option>
            {current.duration !== '...' && <option>
              {current.duration} minutes
            </option>}
          </select>
        </div>
        <div>
          <label htmlFor="action_reschedule_scheduled_date" className="text-sm opacity-70">Scheduled date:</label>
          <select id="action_reschedule_scheduled_date" className="select" value={current.date} onChange={e => dispatchCurrent({ type: 'date', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {current.availableDates.map(date => <option value={date} key={date}>
              {date}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_reschedule_time" className="text-sm opacity-70">Scheduled time:</label>
          <select id="action_reschedule_time" className="select" value={current.meeting} onChange={e => dispatchCurrent({ type: 'meeting', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {current.availableMeetings.map(meeting => <option value={meeting.$id} key={meeting.$id}>
              {format(meeting.startTime, 'HH:mm')} - {format(meeting.endTime, 'HH:mm')}
            </option>)}
          </select>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div>
          <p>Proposed</p>
        </div>
        <div>
          <label htmlFor="action_proposal_recipient" className="text-sm opacity-70">{fetchedProfile.student ? 'Instructor' : 'Student'}:</label>
          <select id="action_proposal_recipient" className="select" disabled={!currentFound} value={proposal.recipient} onChange={e => dispatchProposal({ type: 'recipient', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {recipients.map(recipient => <option value={recipient.$id} key={recipient.$id}>
              {recipient.name}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_proposal_duration" className="text-sm opacity-70">Duration:</label>
          <select id="action_proposal_duration" className="select" disabled={!currentFound} value={proposal.duration} onChange={e => dispatchProposal({ type: 'duration', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {proposal.availableDurations.map(duration => <option value={duration} key={duration}>
              {duration} minutes
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_proposal_scheduled_date" className="text-sm opacity-70">Scheduled date:</label>
          <select id="action_proposal_scheduled_date" className="select" disabled={!currentFound} value={proposal.date} onChange={e => dispatchProposal({ type: 'date', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {proposal.availableDates.map(date => <option value={date} key={date}>
              {date}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_proposal_time" className="text-sm opacity-70">Scheduled time:</label>
          <select id="action_proposal_time" className="select" disabled={!currentFound} value={proposal.meeting} onChange={e => dispatchProposal({ type: 'meeting', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {proposal.availableMeetings.map(meeting => <option value={meeting.$id} key={meeting.$id}>
              {format(meeting.startTime, 'HH:mm')} - {format(meeting.endTime, 'HH:mm')}
            </option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

export default ActionReschedule;