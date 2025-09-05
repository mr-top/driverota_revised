import { useState, useReducer, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { createUser, sendCode } from "../awConfig.js";

import { verifyEmail, verifyPassword, verifyName, verifyCode } from './utils/verifyInputs.js';

import { NotificationContext } from "../context/NotificationContext.jsx";

function reducerCredentials(state, action) {
  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload, nameValid: verifyName(action.payload) }
    case 'email':
      return { ...state, email: action.payload, emailValid: verifyEmail(action.payload) }
    case 'code':
      return { ...state, code: action.payload, codeValid: action.payload.length === 6 }
    case 'password':
      return { ...state, password: action.payload, passwordValid: verifyPassword(action.payload) }
    case 'password2':
      return { ...state, password2: action.payload, password2Valid: verifyPassword(action.payload) && state.password === action.payload }
    case 'instructorCode':
      return { ...state, instructorCode: action.payload, instructorCodeValid: verifyCode(action.payload) }
    case 'student':
      return { ...state, student: !state.student }
  }
}

function reducerVerification(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: action.payload }
    case 'countdown_initial':
      return { ...state, countdown: action.payload }
    case 'countdown_sub':
      return { ...state, countdown: state.countdown - 1 }
  }
}

function Signup() {
  const navigate = useNavigate();

  const { addNotification } = useContext(NotificationContext);

  const [credentials, dispatchCredentials] = useReducer(reducerCredentials, {
    name: '',
    email: '',
    code: '',
    password: '',
    password2: '',
    instructorCode: '',
    student: true
  });

  const [verification, dispatchVerification] = useReducer(reducerVerification, {
    loading: false,
    countdown: 0
  });

  const [loading, setLoading] = useState(false);


  async function submit() {
    setLoading(true);

    try {
      const allInputValid = credentials.nameValid && credentials.emailValid && credentials.passwordValid && credentials.password2Valid && (credentials.instructorCodeValid || !credentials.student);

      if (!allInputValid) throw Error('Sorry! Not all inputs are correct');

      const result = await createUser(credentials);

      if (result.success) {
        addNotification({ display: true, state: 'success', msg: result.msg, timer: true, seconds: 15 });
        navigate('/signin');
      } else {
        throw Error(result.msg);
      }
    } catch (error) {
      addNotification({ display: true, state: 'error', msg: error.message, timer: true, seconds: 10 });
    }

    setLoading(false);
  }

  async function doVerify() {
    dispatchVerification({ type: 'loading', payload: true });

    try {
      if (!credentials.emailValid) throw Error("Email format is not valid to send code");

      const result = await sendCode(credentials);

      if (result.success) {
        addNotification({ display: true, state: 'success', msg: result.msg, timer: true, seconds: 15 });

        dispatchVerification({ type: 'countdown_initial', payload: 60 });

        for (let number = 1; number <= 60; number++) {
          setTimeout(() => {
            dispatchVerification({ type: 'countdown_sub' });
          }, number * 1000)
        }
      } else {
        throw Error(result.msg);
      }
    } catch (error) {
      addNotification({ display: true, state: 'error', msg: error.message, timer: true, seconds: 10 });
    }

    dispatchVerification({ type: 'loading', payload: false });
  }

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
          <input id='signup_name' type="text" className={`input ${credentials.name && (!credentials.nameValid && 'border-1 border-error')}`} value={credentials.name} onChange={e => dispatchCredentials({ type: 'name', payload: e.currentTarget.value })} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_email" className="text-sm opacity-70">Email:</label>
          <input id='signup_email' type="text" className={`input ${credentials.email && (!credentials.emailValid && 'border-1 border-error')}`} value={credentials.email} onChange={e => dispatchCredentials({ type: 'email', payload: e.currentTarget.value })} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_code" className="text-sm opacity-70">Verification code:</label>
          <div className="flex space-x-2">
            <input id='signup_code' type="text" className={`input ${credentials.code && (!credentials.codeValid && 'border-1 border-error')}`} value={credentials.code} onChange={e => dispatchCredentials({ type: 'code', payload: e.currentTarget.value })} />
            <button className="btn btn-secondary" onClick={doVerify} disabled={verification.loading || verification.countdown}>{verification.countdown || 'Send'}</button>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_password" className="text-sm opacity-70">Password:</label>
          <input id='signup_password' type="text" className={`input ${credentials.password && (!credentials.passwordValid && 'border-1 border-error')}`} value={credentials.password} onChange={e => dispatchCredentials({ type: 'password', payload: e.currentTarget.value })} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signup_password2" className="text-sm opacity-70">Confirm password:</label>
          <input id='signup_password2' type="text" className={`input ${credentials.password2 && (!credentials.password2Valid && 'border-1 border-error')}`} value={credentials.password2} onChange={e => dispatchCredentials({ type: 'password2', payload: e.currentTarget.value })} />
        </div>
        {credentials.student &&
          <div className="flex flex-col">
            <label htmlFor="signup_code" className="text-sm opacity-70">Instructor code:</label>
            <input id='signup_code' type="text" className={`input ${credentials.instructorCode && (!credentials.instructorCodeValid && 'border-1 border-error')}`} value={credentials.instructorCode} onChange={e => dispatchCredentials({ type: 'instructorCode', payload: e.currentTarget.value })} />
          </div>
        }
        <div className="flex space-x-4">
          <label htmlFor="signup_code" className="opacity-70">Student:</label>
          <input id='signup_code' type="checkbox" className="checkbox" checked={credentials.student} onChange={e => dispatchCredentials({ type: 'student' })} />
        </div>
      </div>
      <div className="flex space-x-5">
        <div>
          <button className="btn btn-primary rounded-full" disabled={loading} onClick={submit}>{loading ? <span className="loading loading-spinner loading-md"></span> : 'Submit'}</button>
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