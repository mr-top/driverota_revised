import ClassroomCard from "../ClassroomCard";

function SettingsInstructor({ children }) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <p>Classroom (instructor)</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default SettingsInstructor;