import React, { useContext } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Appstate } from '../App';
import { Login } from '@mui/icons-material';


function Header() {
  const useAppstate = useContext(Appstate)

  return (
    <div className='flex fixed md:h-14 h-20 z-10 top-0 w-full bg-[#15161a] justify-between items-center text-3xl font-bold p-3 border-b-2'>
      <Link to={"/"}>
        <div className=' text-red-500'>
          Movie <span className='text-white'>Review</span>
        </div>
      </Link>
      {
      useAppstate.login ?
      <Link to={"/addmovie"}>
        <Button className='text-xl flex items-center px-3 py-1 rounded'>
          <AddIcon className='mr-1 text-white' />{" "}
          <span className='text-white'>Add New</span>
        </Button>
      </Link> :
      <Link to={"/login"}>
       <Button className='text-xl flex items-center px-3 py-1 rounded'>
          <Login className='mr-1 text-white' />{" "}
          <span className='text-white'>Login</span>
        </Button>
      </Link> 
      }
    </div>
  );
}

export default Header