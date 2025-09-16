import { useState, useReducer, useEffect } from "react";

import { verifyEmail, verifyCode } from '../utils/verifyInputs';

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducer(state, action) {
  switch (action.type) {
    case 'content':
      return { ...state, changed: action.payload !== state.prevContent, saved: false, content: action.payload }
    case 'save':
      return { ...state, changed: !action.payload, saved: action.payload, prevContent: state.content }
  }
}

function SettingsAccount({ fetchedProfile }) {
  const [changed, setChanged] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, dispatchEmail] = useReducer(reducer, {
    content: fetchedProfile.email,
    prevContent: fetchedProfile.email,
    changed: false,
    saved: false
  });

  const [password, dispatchPassword] = useReducer(reducer, {
    content: '',
    prevContent: '',
    changed: false,
    saved: false
  });

  const [password2, dispatchPassword2] = useReducer(reducer, {
    content: '',
    prevContent: '',
    changed: false,
    saved: false
  });

  const [code, dispatchCode] = useReducer(reducer, {
    content: '',
    prevContent: '',
    changed: false,
    saved: false
  });

  useEffect(() => {
    if (email.changed || password.changed) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [email, password]);

  useEffect(() => {
    if (changed) {
      setSaved(false);
    }
  }, [changed]);

  function saveAccount() {
    setLoading(true);

    // blah

    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center space-x-2">
        <p>Account information</p>
        {changed && <DocumentArrowUpIcon className="size-4" />}
        {saved && <DocumentCheckIcon className="size-4" />}
      </div>
      <div>
        <label htmlFor="" className="text-sm opacity-70">Email:</label>
        <input type="text" className="input" value={email.content} onChange={e => dispatchEmail({ type: 'content', payload: e.currentTarget.value })} />
      </div>
      <div>
        <label htmlFor="" className="text-sm opacity-70">Password:</label>
        <input type="text" className="input" value={password.content} onChange={e => dispatchPassword({ type: 'content', payload: e.currentTarget.value })} />
      </div>
      <div>
        <label htmlFor="" className="text-sm opacity-70">Confirm password:</label>
        <input type="text" className="input" value={password2.content} onChange={e => dispatchPassword2({ type: 'content', payload: e.currentTarget.value })} />
      </div>
      <div>
        <label htmlFor="" className="text-sm opacity-70">Verification code:</label>
        <div className="flex space-x-2">
          <input type="text" className="input" value={code.content} onChange={e => dispatchCode({ type: 'content', payload: e.currentTarget.value })} />
          <button className="btn btn-secondary" disabled={!changed || !verifyEmail(email.content)}>Send</button>
        </div>
      </div>
      <div className="mt-5">
        <button className="btn btn-primary" onClick={saveAccount} disabled={(!changed || loading) || !verifyCode(code.content)}>
          {loading ? <span className="loading loading-spinner loading-md"></span> : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default SettingsAccount;