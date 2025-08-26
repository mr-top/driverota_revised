import { useState } from "react";

function Signup() {
  const [isStudent, setIsStudent] = useState(true);

  return (
    <div className="flex flex-col justify-start items-center space-y-5 py-15 max-w-100 w-screen min-h-140 bg-base-200 border-[0.5px] border-base-content rounded-md">
      <div>
        <p className="text-3xl">Sign Up</p>
      </div>
      <div className="w-60 space-y-2">
        <div className="flex flex-col">
          <label htmlFor="signup_username" className="text-sm opacity-70">Username:</label>
          <input id='signup_username' type="text" className="input" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_email" className="text-sm opacity-70">Email:</label>
          <input id='signup_email' type="text" className="input" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_password" className="text-sm opacity-70">Password:</label>
          <input id='signup_password' type="text" className="input" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_password2" className="text-sm opacity-70">Confirm password:</label>
          <input id='signup_password2' type="text" className="input" />
        </div>
        {isStudent &&
          <div className="flex flex-col">
            <label htmlFor="signup_code" className="text-sm opacity-70">Instructor code:</label>
            <input id='signup_code' type="text" className="input" />
          </div>
        }
        <div className="flex space-x-4">
          <label htmlFor="signup_code" className="opacity-70">Student:</label>
          <input id='signup_code' type="checkbox" className="checkbox" checked={isStudent} onClick={() => setIsStudent(prev => !prev)} />
        </div>
      </div>
      <div className="flex space-x-5">
        <div>
          <button className="btn btn-primary rounded-full">Submit</button>
        </div>
        <div className="text-sm">
          <p>Have an account?</p>
          <p>Click <a className="font-semibold">here</a> to sign in</p>
        </div>
      </div>
    </div>
  )
}

export default Signup;