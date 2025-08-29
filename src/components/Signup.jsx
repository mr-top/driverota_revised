import { useState, useReducer, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { verifyEmail, verifyPassword } from './utils/verifyInputs.js';

function reducerCredentials(state, action) {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload }
    case 'email':
      return { ...state, email: action.payload }
    case 'password':
      return { ...state, password: action.payload }
    case 'password2':
      return { ...state, password2: action.payload }
    case 'instructorCode':
      return { ...state, instructorCode: action.payload }
    case 'student':
      return { ...state, student: !state.student }
  }
}

function reducerErrors(state, action) {
  switch (action.type) {
    case 'display':
      return { ...state, display: action.payload }
    case 'success':
      return { ...state, success: action.payload }
    case 'msg':
      return { ...state, msg: action.payload }
  }
}

function Signup() {
  const navigate = useNavigate();

  const [credentials, dispatchCredentials] = useReducer(reducerCredentials, {
    name: '',
    email: '',
    password: '',
    password2: '',
    instructorCode: '',
    student: true
  });

  const [errors, dispatchErrors] = useReducer(reducerErrors, {
    display: false,
    success: false,
    msg: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(credentials);
  }, [credentials])

  return (
    <div className="flex flex-col justify-start items-center space-y-5 py-15 max-w-100 w-screen min-h-140 bg-base-200 border-[0.5px] border-base-content rounded-md">
      <div>
        <p className="text-3xl">Sign Up</p>
      </div>
      <div className="w-60 space-y-2">
        <div className="flex flex-col">
          <label htmlFor="signup_name" className="text-sm opacity-70">Name:</label>
          <input id='signup_name' type="text" className="input" value={credentials.name} onChange={e => dispatchCredentials({ type: 'name', payload: e.currentTarget.value })} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_email" className="text-sm opacity-70">Email:</label>
          <input id='signup_email' type="text" className="input" value={credentials.email} onChange={e => dispatchCredentials({ type: 'email', payload: e.currentTarget.value })} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_password" className="text-sm opacity-70">Password:</label>
          <input id='signup_password' type="text" className="input" value={credentials.password} onChange={e => dispatchCredentials({ type: 'password', payload: e.currentTarget.value })} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_password2" className="text-sm opacity-70">Confirm password:</label>
          <input id='signup_password2' type="text" className="input" value={credentials.password2} onChange={e => dispatchCredentials({ type: 'password2', payload: e.currentTarget.value })} />
        </div>
        {credentials.student &&
          <div className="flex flex-col">
            <label htmlFor="signup_code" className="text-sm opacity-70">Instructor code:</label>
            <input id='signup_code' type="text" className="input" value={credentials.instructorCode} onChange={e => dispatchCredentials({ type: 'instructorCode', payload: e.currentTarget.value })} />
          </div>
        }
        <div className="flex space-x-4">
          <label htmlFor="signup_code" className="opacity-70">Student:</label>
          <input id='signup_code' type="checkbox" className="checkbox" checked={credentials.student} onChange={e => dispatchCredentials({ type: 'student' })} />
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
      {errors.display &&
        <div className="w-60">
          <p className={`${errors.success ? 'text-success' : 'text-error'}`}>{errors.msg}</p>
        </div>}
    </div>
  )
}

export default Signup;