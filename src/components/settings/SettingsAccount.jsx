import { useState, useReducer, useEffect, useContext } from "react";

import { verifyEmail, verifyCode } from '../utils/verifyInputs';

import { NotificationContext } from "../../context/NotificationContext";

import { updateAccount, sendCode } from "../../awConfig";

import { DocumentArrowUpIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

function reducer(state, action) {
  switch (action.type) {
    case 'content':
      return { ...state, changed: action.payload !== state.prevContent, saved: false, content: action.payload }
    case 'save':
      return { ...state, changed: !action.payload, saved: action.payload, prevContent: state.content }
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

function SettingsAccount({ fetchedProfile }) {
  const { addNotification } = useContext(NotificationContext);

  const [changed, setChanged] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [verification, dispatchVerification] = useReducer(reducerVerification, {
    loading: false,
    countdown: 0
  });

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

  async function saveAccount() {
    setLoading(true);

    if (changed) {
      const result = await updateAccount(fetchedProfile.$id, email, password, code);

      console.log(result);
      
      if (email.changed) {
        addNotification({ display: true, state: result.emailChanged ? 'success' : 'error', msg: result.emailChanged ? 'Email was changed' : 'Email was not changed', subMsg: result.msg, timer: true, seconds: 15 });
      }

      if (password.changed) {
        addNotification({ display: true, state: result.passwordChanged ? 'success' : 'error', msg: result.passwordChanged ? 'Password was changed' : 'Password was not changed', subMsg: result.msg, timer: true, seconds: 15 });
      }

      if (result.success) {
        setSaved(true);
        dispatchEmail({ type: 'save', payload: true });
        dispatchPassword({ type: 'save', payload: true });
      }
    }

    setLoading(false);
  }

  async function doVerify() {
    dispatchVerification({ type: 'loading', payload: true });

    try {
      if (!verifyEmail(email.content)) throw Error("Email format is not valid to send code");

      const result = await sendCode(email.content);

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
          <button className="btn btn-secondary" onClick={doVerify} disabled={!changed || !verifyEmail(email.content) || verification.loading || verification.countdown}>{verification.countdown || 'Send'}</button>
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