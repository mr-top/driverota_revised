import { useOutletContext, Outlet, Navigate } from "react-router-dom"

function ProtectedRoute({logout}) {
  const { fetchedProfile } = useOutletContext();

  console.log('this is coming from protected route')
  console.log(fetchedProfile)

  return (
    fetchedProfile.logged ?
      <Outlet context={{logout}}/> :
      <Navigate />
  )
}

export default ProtectedRoute