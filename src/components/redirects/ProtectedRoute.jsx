import { useOutletContext, Outlet, Navigate } from "react-router-dom"

function ProtectedRoute({logout}) {
  const { fetchedProfile } = useOutletContext();
  
  return (
    fetchedProfile.logged ?
      <Outlet context={{logout, fetchedProfile}}/> :
      <Navigate to='/error'/>
  )
}

export default ProtectedRoute