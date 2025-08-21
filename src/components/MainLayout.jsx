import { Outlet } from "react-router-dom";

function MainLayout() {

  return (
    <div className="flex-1 flex justify-center items-center">
      <Outlet /> 
    </div>
  )
}

export default MainLayout;