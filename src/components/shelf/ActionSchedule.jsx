import { useReducer, useEffect, useState, useContext} from "react";
import { useOutletContext } from "react-router-dom";

import { format } from "date-fns";

import getDateSlots from "../utils/getDateSlots";

import { createBooking } from "../../awConfig";

import { NotificationContext } from "../../context/NotificationContext";

import { CheckIcon } from "@heroicons/react/24/outline";

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

      const duration = Number(action.payload);

      const availableMeetings = getDateSlots(state.givenMeetings, state.foundPref, duration);
      const availableDates = Object.keys(availableMeetings);

      return { ...state, duration, date, availableMeetings, meeting, availableDates }
    }
    case 'date': {
      const meeting = '...';
      const date = action.payload;

      return { ...state, meeting, date }
    }
    case 'meeting': {
      const meeting = action.payload;

      return { ...state, meeting }
    }
  }
}

function ActionSchedule() {
  const { addNotification } = useContext(NotificationContext);
  const { fetchedProfile, meetings, classroom, recipients, instructorPrefs } = useOutletContext();

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

  const [proposalValid, setProposalValid] = useState(false);

  useEffect(() => {
    if (proposal.meeting !== '...') {
      setProposalValid(true);
    } else {
      setProposalValid(false);
    }
  }, [proposal.meeting]);

  async function onSubmitClick() {
    if (proposal.meeting !== '...') {
      const result = await createBooking(proposal, proposal.duration, fetchedProfile.$id, classroom.$id);

      if (result.success) {
        addNotification({display: true, state: 'success', msg: 'Success!', subMsg: result.msg});
      } else {
        addNotification({display: true, state: 'error', msg: 'Failed!', subMsg: result.msg});
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center space-y-4">
      <div className="flex-1 flex flex-col w-50">
        <div className="flex items-center space-x-2">
          <p>Proposed</p>
          {proposalValid && <div>
            <CheckIcon className='size-4' />
          </div>}
        </div>
        <div>
          <label htmlFor="action_schedule_recipient" className="text-sm opacity-70">{fetchedProfile.student ? 'Instructor' : 'Student'}:</label>
          <select id="action_schedule_recipient" className="select" value={proposal.recipient} onChange={e => dispatchProposal({ type: 'recipient', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {recipients.map(recipient => <option value={recipient.$id} key={recipient.$id}>
              {recipient.name}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_schedule_duration" className="text-sm opacity-70">Duration:</label>
          <select id="action_schedule_duration" className="select" value={proposal.duration} onChange={e => dispatchProposal({ type: 'duration', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {proposal.availableDurations.map(duration => <option value={duration} key={duration}>
              {duration} minutes
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_schedule_date" className="text-sm opacity-70">Proposal date:</label>
          <select id="action_schedule_date" className="select" value={proposal.date} onChange={e => dispatchProposal({ type: 'date', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {proposal.availableDates.map(date => <option value={date} key={date}>
              {date}
            </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="action_schedule_time" className="text-sm opacity-70">Proposal time:</label>
          <select id="action_schedule_time" className="select" value={proposal.meeting} key={proposal.date} onChange={e => dispatchProposal({ type: 'meeting', payload: e.currentTarget.value })}>
            <option value={'...'} disabled>...</option>
            {proposal.availableMeetings[proposal.date]?.map(meetingStart => <option value={meetingStart.toString()} key={meetingStart}>
              {format(meetingStart.toString(), 'HH:mm')}
            </option>)}
          </select>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" disabled={!proposalValid} onClick={onSubmitClick}>Submit</button>
      </div>
    </div>
  )
}

export default ActionSchedule;