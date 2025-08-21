import { useOutletContext } from "react-router-dom";

function Signin () {
  const context = useOutletContext();

  console.log('this is coming from sign')
  console.log(context);

  return (
    <p>Sign In bro</p>
  )
}

export default Signin;