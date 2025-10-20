function SettingsClassroomConfirmModal({classroom, submitClassroomChange, modalLoading}) {
  return (
    <dialog id="settings_student_classroom_confirm_modal" className="modal">
      {classroom && (
        <div className="flex flex-col items-center modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to change to this classroom?</h3>
          <p className="pt-4 text-xl text-bold">{classroom.name}</p>
          <div className="flex flex-col w-40">
            <div className="flex justify-between items-center">
              <p className="opacity-70 text-sm">Instructor name: </p>
              <p>{classroom.instructorName}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="opacity-70 text-sm">Classroom size: </p>
              <p>{classroom.students.length}</p>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={submitClassroomChange} disabled={modalLoading}>Confirm</button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      )}
    </dialog>
  )
}

export default SettingsClassroomConfirmModal;