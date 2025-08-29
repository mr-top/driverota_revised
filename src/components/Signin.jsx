import { useState, useReducer, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { verifyEmail, verifyPassword } from './utils/verifyInputs.js';

import { NotificationContext } from "../context/NotificationContext.jsx";

function reducerCredentials(state, action) {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.payload }
    case 'password':
      return { ...state, password: action.payload }
  }
}

function Signin() {
  const navigate = useNavigate();
  const { login } = useOutletContext();

  const { addNotification } = useContext(NotificationContext);

  const [credentials, dispatchCredentials] = useReducer(reducerCredentials, {
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    try {
      if (!verifyEmail(credentials.email) && !verifyPassword(credentials.password)) {
        throw Error('Sorry! Email and password are both in the wrong format');
      } else if (!verifyEmail(credentials.email)) {
        throw Error('Sorry! Email is in the wrong format');
      } else if (!verifyPassword(credentials.password)) {
        throw Error('Sorry! Password is in the wrong format');
      }

      const result = await login(credentials);

      if (result.success) {
        setTimeout(() => {
          navigate('/about');
        }, 5000)

        addNotification({ display: true, state: 'success', msg: 'Logged in!', seconds: 5 });
      } else {
        throw Error(result.msg);
      }

    } catch (error) {
      addNotification({ display: true, state: 'error', msg: error.message, seconds: 5 });
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col justify-start items-center space-y-5 py-15 max-w-100 w-screen min-h-140 bg-base-200 border-[0.5px] border-base-content rounded-md">
      <div>
        <p className="text-3xl">Sign In</p>
      </div>
      <div className="w-60 space-y-2">
        <div className="flex flex-col">
          <label htmlFor="signin_email" className="text-sm opacity-70">Email:</label>
          <input id='signin_email' type="text" className="input" value={credentials.email} onChange={e => dispatchCredentials({ type: 'email', payload: e.currentTarget.value })} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signin_password" className="text-sm opacity-70">Password:</label>
          <input id='signin_password' type="text" className="input" value={credentials.password} onChange={e => dispatchCredentials({ type: 'password', payload: e.currentTarget.value })} />
        </div>
      </div>
      <div className="flex space-x-5">
        <div>
          <button className="btn btn-primary rounded-full" disabled={loading} onClick={submit}>{loading ? <span className="loading loading-spinner loading-md"></span> : 'Submit'}</button>
        </div>
        <div className="text-sm">
          <p>Forgot password?</p>
          <p>Click <a className="font-semibold">here</a> to reset it</p>
        </div>
      </div>
    </div>
  )
}

export default Signin;