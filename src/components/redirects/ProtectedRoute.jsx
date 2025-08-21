import { useOutletContext, Outlet, Navigate } from "react-router-dom"

function ProtectedRoute() {
  const { fetchedProfile } = useOutletContext();

  console.log('this is coming from protected route')
  console.log(fetchedProfile)

  return (
    fetchedProfile.logged ?
      <Outlet /> :
      <Navigate />
  )
}

export default ProtectedRoute