import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import {query, where, getDocs} from 'firebase/firestore'
import { usersRef } from "../Firebase/Firebase";
import { Appstate } from "../App";
import bcrypt from 'bcryptjs'
import swal from "sweetalert";
import { Button } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const useAppstate = useContext(Appstate);
  const [form, setForm] = useState({
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const quer = query(usersRef, where('mobile', '==', form.mobile))
      const querySnapshot = await getDocs(quer);

      querySnapshot.forEach((doc) => {
        const _data = doc.data();
        const isUser = bcrypt.compareSync(form.password, _data.password);
        if(isUser) {
          useAppstate.setLogin(true);
          useAppstate.setUserName(_data.name);
          swal({
            title: "Logged In",
            icon: "success",
            buttons: false,
            timer: 3000
          })
          navigate('/')
        } else {
          swal({
            title: "Invalid Credentials",
            icon: "error",
            buttons: false,
            timer: 3000
          })
        }
      })
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000
      })
    }
    setLoading(false);
  }

  return (
    <div className='shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col mt-48 w-4/5 md:w-2/5 mx-auto bg-[#15161a]'>
      <div className='mb-4'>
        <label
          className='block text-grey-darker text-sm font-bold mb-2'
        >
          Mobile No.
        </label>
        <input
          className='shadow text-black border outline-none rounded w-full py-2 px-3 text-grey-darker'
          id='mobile'
          type='number'
          value={form.mobile}
          placeholder='mobile number'
          onChange={(e)=>setForm({...form, mobile:e.target.value})}
        />
      </div>
      <div className='mb-6'>
        <label
          className='block text-grey-darker text-sm font-bold mb-2'
        >
          Password
        </label>
        <input
          className='shadow text-black outline-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3'
          id='password'
          type='password'
          value={form.password}
          placeholder='password'
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />
      </div>
      <Button 
        onClick={login}
        variant="contained"
        className='bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded'
        type='button'
      >
        {loading ? <TailSpin height={28} color='white'/> : 'Login'}
      </Button>
      <div className='mt-4 text-center'>
          <p>Don't have account ? <Link to={'/signup'}> <span className='text-blue-400'>Sign up</span></Link></p>
      </div>
    </div>
  );
};

export default Login;
