function SettingsStudent({ children }) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <p>Classroom (student)</p>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default SettingsStudent;