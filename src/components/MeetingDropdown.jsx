import { useNavigate } from "react-router-dom";

function MeetingDropdown({ meeting, fetchedProfile }) {
  const navigate = useNavigate();

  const isStudent = fetchedProfile.student;
  const isIncluded = meeting.studentId === fetchedProfile.$id;

  let content;

  if (isStudent) {
    // user is student

    if (isIncluded) {
      // student is involved in meeting, more controls
      content = (
        <>
          <li onClick={e => navigate('/shelf/actions/reschedule', { state: { meeting } })}><a>Rechedule</a></li>
          <li onClick={e => navigate('/shelf/actions/cancel', { state: { meeting } })}><a>Cancel</a></li>
        </>
      )
    } else {
      return <></>
    }
  } else {
    // user is instructor

    content = (
      <>
        <li onClick={e => navigate('/shelf/actions/reschedule', { state: { meeting } })}><a>rechedule</a></li>
        <li onClick={e => navigate('/shelf/actions/cancel', { state: { meeting } })}><a>Cancel</a></li>
      </>
    )
  }

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-primary mb-1">Actions</div>
      <ul tabIndex="-1" className="dropdown-content menu bg-base-300 rounded-box z-1 w-30 p-1 shadow-sm">
        {content}
      </ul>
    </div>
  )
}

export default MeetingDropdown;