import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

function ShelfPending({ classroom }) {
  return (
    <div className="flex flex-col justify-center items-center bg-warning w-80 sm:w-100 h-fit px-8 py-8 space-y-2 rounded-xl">
      <div>
        <ShieldExclamationIcon className="size-14 text-warning-content" />
      </div>
      <p className="text-lg sm:text-2xl text-warning-content font-bold">Request is pending</p>
      <p className="text-xs sm:text-sm text-warning-content text-center opacity-80">
        Your request to join {classroom.name ? <strong>{classroom.name}</strong> : 'this'} classroom is still pending
      </p>
      <p className="text-xs sm:text-sm text-warning-content text-center opacity-80">
        Please notify your instructor {classroom.instructorName && <strong>({classroom.instructorName}) </strong>}to accept, or alternatively go to your profile settings to change your classroom
      </p>
    </div>
  )
}

export default ShelfPending;