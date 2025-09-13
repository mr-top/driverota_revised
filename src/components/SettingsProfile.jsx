import { useReducer, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import deepEqual from "deep-equal";

import { verifyEmail, verifyCode } from './utils/verifyInputs';

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducerCredentials(state, action) {
  const currentProperties = { name: state.name };

  switch (action.type) {
    case 'name':
      return { ...state, name: action.payload, changed: !deepEqual({ ...currentProperties, name: action.payload }, state.prevProperties) }
    case 'save':
      return {
        ...state, saved: action.payload, changed: action.payload ? false : state.changed, prevProperties: action.payload ? currentProperties : state.prevProperties
      }
    case 'loading':
      return { ...state, loading: action.payload }
  }
}

function reducerCrucialInformation(state, action) {
  const currentProperties = { email: state.email, password: state.password, password2: state.password2 };

  switch (action.type) {
    case 'email':
      return { ...state, email: action.payload, changed: !deepEqual({ ...currentProperties, email: action.payload }, state.prevProperties) }
    case 'password':
      return { ...state, password: action.payload, changed: !deepEqual({ ...currentProperties, password: action.payload }, state.prevProperties) }
    case 'password2':
      return { ...state, password2: action.payload, changed: !deepEqual({ ...currentProperties, password2: action.payload }, state.prevProperties) }
    case 'code':
      return { ...state, code: action.payload }
    case 'save':
      return {
        ...state, saved: action.payload, changed: action.payload ? false : state.changed, prevProperties: action.payload ? currentProperties : state.prevProperties
      }
    case 'loading':
      return { ...state, loading: action.payload }
  }
}

function SettingsProfile() {
  const { fetchedProfile } = useOutletContext();

  const [credentials, dispatchCredentials] = useReducer(reducerCredentials, {
    name: fetchedProfile.name,
    changed: false,
    saved: false,
    loading: false,
    prevProperties: {
      name: fetchedProfile.name
    }
  });

  const [crucial, dispatchCrucial] = useReducer(reducerCrucialInformation, {
    email: fetchedProfile.email,
    password: '',
    password2: '',
    code: '',
    changed: false,
    saved: false,
    loading: false,
    prevProperties: {
      email: fetchedProfile.email,
      password: '',
      password2: ''
    }
  });

  useEffect(() => {
    if (credentials.changed) {
      dispatchCredentials({ type: 'save', payload: false });
    }
  }, [credentials.changed]);

  useEffect(() => {
    if (crucial.changed) {
      dispatchCrucial({ type: 'save', payload: false });
    }
  }, [crucial.changed]);

  function savePersonal() {
    dispatchCredentials({ type: 'loading', payload: true });

    if (credentials.changed) {
      dispatchCredentials({ type: 'save', payload: true });
    }

    dispatchCredentials({ type: 'loading', payload: false });
  }

  function saveAccount() {
    dispatchCrucial({ type: 'loading', payload: true });

    if (crucial.changed) {
      dispatchCrucial({ type: 'save', payload: true });
    }

    dispatchCrucial({ type: 'loading', payload: false });
  }

  return (
    <div className="px-10 space-y-5">
      <div>
        <div className="flex items-center space-x-2">
          <p>Personal information</p>
          {credentials.changed && <DocumentArrowUpIcon className="size-4" />}
          {credentials.saved && <DocumentCheckIcon className="size-4" />}
        </div>
        <div>
          <label htmlFor="" className="text-sm opacity-70">Name:</label>
          <input type="text" className="input" value={credentials.name} onChange={e => dispatchCredentials({ type: 'name', payload: e.currentTarget.value })} />
        </div>
        <div className="mt-5">
          <button className="btn btn-primary" onClick={savePersonal} disabled={!credentials.changed || credentials.loading}>
          {credentials.loading ? <span className="loading loading-spinner loading-md"></span> : 'Save'}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <p>Account information</p>
          {crucial.changed && <DocumentArrowUpIcon className="size-4" />}
          {crucial.saved && <DocumentCheckIcon className="size-4" />}
        </div>
        <div>
          <label htmlFor="" className="text-sm opacity-70">Email:</label>
          <input type="text" className="input" value={crucial.email} onChange={e => dispatchCrucial({ type: 'email', payload: e.currentTarget.value })} />
        </div>
        <div>
          <label htmlFor="" className="text-sm opacity-70">Password:</label>
          <input type="text" className="input" value={crucial.password} onChange={e => dispatchCrucial({ type: 'password', payload: e.currentTarget.value })} />
        </div>
        <div>
          <label htmlFor="" className="text-sm opacity-70">Confirm password:</label>
          <input type="text" className="input" value={crucial.password2} onChange={e => dispatchCrucial({ type: 'password2', payload: e.currentTarget.value })} />
        </div>
        <div>
          <label htmlFor="" className="text-sm opacity-70">Verification code:</label>
          <div className="flex space-x-2">
            <input type="text" className="input" value={crucial.code} onChange={e => dispatchCrucial({ type: 'code', payload: e.currentTarget.value })} />
            <button className="btn btn-secondary" disabled={!crucial.changed || !verifyEmail(crucial.email)}>Send</button>
          </div>
        </div>
        <div className="mt-5">
        <button className="btn btn-primary" onClick={saveAccount} disabled={(!crucial.changed || crucial.loading) || !verifyCode(crucial.code)}>
          {crucial.loading ? <span className="loading loading-spinner loading-md"></span> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsProfile;