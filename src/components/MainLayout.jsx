import { Outlet } from "react-router-dom";

function MainLayout() {

  return (
    <div className="py-10 flex-1 flex justify-center items-start">
      <Outlet /> 
    </div>
  )
}

export default MainLayout;