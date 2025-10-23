import { useEffect } from "react";

import { useLocation } from "react-router-dom";

function ShelfActions () {
  const location = useLocation();

  useEffect(() => {
    console.log(location.state)
  }, []);

  return (
    <div>
      
    </div>
  )
}

export default ShelfActions;