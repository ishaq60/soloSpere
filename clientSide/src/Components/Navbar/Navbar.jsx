import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../../public/images/logo.png'
import toast from 'react-hot-toast';
const Navbar = () => {
    const {user,logOut}=useContext(AuthContext)
    const handaleLogout=async()=>{
     try{
      logOut()
      toast.success("Logout successfully")

     }
     catch(err) {
    console.log(err);
    console.log(err);
     }
    }
    return (
        <div>
            <div className='navbar bg-base-100 shadow-sm container px-4 mx-auto'>
      <div className='flex-1'>
        <div className='flex gap-2 items-center'>
          <img className='w-auto h-7' src={logo} alt='' />
          <Link to='/' className='font-bold'>SoloSphere</Link>
        </div>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-2'>
      
      <NavLink to="/">
      <li>
         <div>Home</div>
        </li>
      </NavLink>
      <NavLink to="/all-jobs">
      <li>
         <div>AllJobs</div>
        </li>
      </NavLink>
          {
            !user &&
            <NavLink to='/login'>
      <li>
          <div>Login</div>
           </li>
            </NavLink>
      
          }
        </ul>

    {
        user && 
        <div className='dropdown dropdown-end z-50'>
        <div
          tabIndex={0}
          role='button'
          className='btn btn-ghost btn-circle avatar'
        >
          <div className='w-10 rounded-full' title={user?.displayName}>
            <img
        
              referrerPolicy='no-referrer'
              alt='User Profile Photo'
              src={user.photoUrl}
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
        >
          <li>
            <Link to='/add-job' className='justify-between'>Add Job</Link>
          </li>
          <li>
            <Link to='/my-posted-job'>My Posted Jobs</Link>
          </li>
          <li>
          <Link to='/my-bids'>My Bids</Link>
          </li>
          <Link to='/bid-request'>
            <div>Bid Requests</div>
          </Link >
          <li className='mt-2'>
            <button onClick={handaleLogout} className='bg-gray-200 block text-center'>Logout</button>
          </li>
        </ul>
      </div>
    }
      </div>
    </div>
        </div>
    );
};

export default Navbar;