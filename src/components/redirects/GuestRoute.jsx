import { useOutletContext, Outlet, Navigate } from "react-router-dom"

function GuestRoute({login}) {
  const { fetchedProfile } = useOutletContext();

  console.log('this is coming from protected route')
  console.log(fetchedProfile)

  return (
    !fetchedProfile.logged ?
      <Outlet context={{login}}/> :
      <Navigate />
  )
}

export default GuestRoute;