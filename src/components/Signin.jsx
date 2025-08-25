function Signin() {
  return (
    <div className="flex flex-col justify-start items-center space-y-5 py-15 max-w-100 w-screen min-h-140 bg-base-200 border-[0.5px] border-base-content rounded-md">
      <div>
        <p className="text-3xl">Sign In</p>
      </div>
      <div className="w-60 space-y-2">
        <div className="flex flex-col">
          <label htmlFor="signin_email" className="text-sm opacity-70">Email:</label>
          <input id='signin_email' type="text" className="input" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="signin_password" className="text-sm opacity-70">Password:</label>
          <input id='signin_password' type="text" className="input" />
        </div>
      </div>
      <div className="flex space-x-5">
        <div>
          <button className="btn btn-primary rounded-full">Submit</button>
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