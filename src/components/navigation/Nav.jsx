import { NavLink } from "react-router-dom";

function Nav({ localProfile }) {
  return (
    <div className="flex justify-around w-full py-4 bg-base-300 border-base-content border-b-[0.5px]">
        <div>
          <NavLink className={({isActive}) => `btn rounded-md border-base-content border-[0.5px] ${isActive ? 'bg-base-100' : 'bg-base-300'}`} to={'/about'}>About</NavLink>
        </div>
        <div>
          <p className="text-4xl">Driverota</p>
        </div>
        <div className="space-x-5">
          {
            localProfile.logged ?
              <>
                <NavLink className={({isActive}) => `btn rounded-md border-base-content border-[0.5px] ${isActive ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}`} to={'/option1'}>option 1</NavLink>
                <NavLink className={({isActive}) => `btn rounded-md border-base-content border-[0.5px] ${isActive ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}`} to={'/option2'}>option 2</NavLink>
                <NavLink className={({isActive}) => `btn rounded-md border-base-content border-[0.5px] ${isActive ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}`} to={'/option3'}>option 3</NavLink>
                <NavLink className={({isActive}) => `btn rounded-md border-base-content border-[0.5px] ${isActive ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}`} to={'/option4'}>option 4</NavLink>
              </> :
              <>
                 <NavLink className={({isActive}) => `btn rounded-md border-base-content border-[0.5px] ${isActive ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}`} to={'/signin'}>Sign in</NavLink>
                 <NavLink className={({isActive}) => `btn rounded-md border-base-content border-[0.5px] ${isActive ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'}`} to={'/signup'}>Sign up</NavLink>
              </>
          }
        </div>
    </div>
  )
}

export default Nav;