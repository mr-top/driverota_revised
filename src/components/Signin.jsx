import { useState, useReducer, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { verifyEmail, verifyPassword } from './utils/verifyInputs.js';

function reducerCredentials(state, action) {
  switch (action.type) {
    case 'email':
      return { ...state, email: action.payload }
    case 'password':
      return { ...state, password: action.payload }
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

function Signin() {
  const navigate = useNavigate();
  const { login } = useOutletContext();

  const [credentials, dispatchCredentials] = useReducer(reducerCredentials, {
    email: '',
    password: ''
  });

  const [errors, dispatchErrors] = useReducer(reducerErrors, {
    display: false,
    success: false,
    msg: ''
  });

  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    let display = false;
    let success = false;
    let message = '';
    // validate inputs
    try {
      if (!verifyEmail(credentials.email) && !verifyPassword(credentials.password)) {
        message = 'Sorry! Email and password are both in the wrong format';
        throw Error();
      } else if (!verifyEmail(credentials.email)) {
        message = 'Sorry! Email is in the wrong format';
        throw Error();
      } else if (!verifyPassword(credentials.password)) {
        message = 'Sorry! Password is in the wrong format';
        throw Error();
      }

      const result = await login(credentials);

      if (result.success) {
        display = true;
        success = true;
        
        setTimeout(() => {
          navigate('/zail');
        }, 5000);
      }

      message = result.msg;

      throw Error();
    } catch (error) {
      display = true;
      dispatchErrors({ type: 'display', payload: display });
      dispatchErrors({ type: 'success', payload: success });
      dispatchErrors({ type: 'msg', payload: message });
    }

    setLoading(false);
  }

  useEffect(() => {
    console.log(errors);
  }, [errors])

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
      {errors.display &&
        <div className="w-60">
          <p className={`${errors.success ? 'text-success' : 'text-error'}`}>{errors.msg}</p>
        </div>}
    </div>
  )
}

export default Signin;