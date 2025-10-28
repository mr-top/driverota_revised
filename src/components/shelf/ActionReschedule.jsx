import { useReducer, useEffect, useState } from "react";
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";

import { parse } from "date-fns";

function reducerDate(state, action) {
  switch (action.type) {
    case 'date':
      return { ...state, date: action.payload }
    case 'time':
      return { ...state, time: action.payload }
  }

}

// dateTime: parse(action.payload, 'yyyy-MM-dd', state.dateTime )
// dateTime: parse(action.payload, 'HH:mm', state.dateTime )

function ActionReschedule() {
  const location = useLocation();
  const { fetchedProfile, meetings, classroom, recipients} = useOutletContext();

  const [selectedDate, dispatchSelectedDate] = useReducer(reducerDate, {
    date: '',
    time: ''
  });

  const [ selectedRecipient, setSelectedRecipient ] = useState({});
  const [ currentDates, setCurrentDates ] = useState([]);
  const [ selectedCurrentDate, setSelectedCurrentDay] = useState({});

  useEffect(() => {
    console.log(selectedRecipient);
  }, [selectedRecipient]);
  return (
    <div className="flex-1 flex flex-col items-center">
      <div>
        <label htmlFor="action_reschedule_recipient" className="text-sm opacity-70">{fetchedProfile.student ? 'Instructor' : 'Student'}:</label>
        <select id="action_reschedule_recipient" className="select">
          {recipients.map(recipient => <option value={recipient.$id} onClick={e => setSelectedRecipient(recipient)}>
            {recipient.name}
          </option>)}
        </select>
      </div>
      <div>
        <label htmlFor="action_reschedule_instructor" className="text-sm opacity-70">Scheduled date:</label>
        <input type="date" className="input" value={selectedDate.date} onChange={e => dispatchSelectedDate({ type: 'date', payload: e.currentTarget.value })} />
      </div>
      <div>
        <label htmlFor="action_reschedule_instructor" className="text-sm opacity-70">Scheduled time:</label>
        <select id="action_reschedule_instructor" defaultValue={classroom.instructorId} className="select">
          <option disabled={true} value={classroom.instructorId}>{classroom.instructorName}</option>
        </select>
      </div>
    </div>
  )
}

export default ActionReschedule;