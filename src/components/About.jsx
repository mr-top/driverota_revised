function About() {
  return (
    <div className="flex flex-col justify-start items-center max-w-240 w-screen h-140 p-10 bg-base-100">
      <div className="flex flex-col md:flex-row md:justify-between items-center w-full h-100 md:h-80 space-y-5 md:space-y-5 md:space-x-10">
        <div className="flex flex-col justify-around h-full w-full max-w-80">
          <div className="flex flex-col space-y-2">
            <p className="text-4xl font-prosto">Declutter your calendar</p>
            <p>Lesson booking platform to simplify scheduling for driving instructors</p>
          </div>
          <div className="space-x-4 ">
            <button className="btn btn-primary rounded-full">Get Started</button>
            <button className="btn btn-secondary rounded-full">FAQ</button>
          </div>
        </div>
        <div className="h-full max-h-80 w-full max-w-120">
          <div className="mockup-browser border border-base-300 h-full w-full rounded-md bg-base-300">
            <div className="mockup-browser-toolbar">
              <div className="input">https://driverota.com</div>
            </div>
            <div className="grid place-content-center">Hello!</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;