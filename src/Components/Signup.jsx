import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {getAuth, RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth'
import { usersRef } from "../Firebase/Firebase";
import app from "../Firebase/Firebase";
import { Button } from "@mui/material";
import swal from "sweetalert";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';
const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, auth);
  }

  const requestOtp = () => {
      setLoading(true);
      generateRecaptha();
      let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
        .then(confirmationResult => {
          window.confirmationResult = confirmationResult;
          swal({
            text: "OTP Sent",
            icon: "success",
            buttons: false,
            timer: 3000,
          });
          setOtpSent(true);
          setLoading(false);
        }).catch((error) => {
          console.log(error)
        })
  }

  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          text: "Sucessfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate('/login')
        setLoading(false); 
      })
    } catch (error) {
      console.log(error);
    }
  }

  const uploadData = async () => {
    try {
      const salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(form.password, salt);
      await addDoc(usersRef, {
        name: form.name,
        password: hash,
        mobile: form.mobile
      });
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className='shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col mt-48 w-4/5 md:w-2/5 mx-auto bg-[#15161a]'>
      {otpSent ? (
        <>
          <div className='mb-4'>
            <label className='block text-grey-darker text-sm font-bold mb-2'>
              One Time Password (OTP)
            </label>
            <input
              className='shadow text-black border outline-none rounded w-full py-2 px-3 text-grey-darker'
              id='OTP'
              value={OTP}
              placeholder='otp'
              onChange={(e) => setOTP(e.target.value )}
            />
          </div>
          <Button
          onClick={verifyOTP}
            variant='contained'
            className='bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded'
            type='button'
          >
            {loading ? <TailSpin height={28} color='white' /> : "Confirm Otp"}
          </Button>
        </>
      ) : (
        <>
          <div className='mb-4'>
            <label className='block text-grey-darker text-sm font-bold mb-2'>
              Name
            </label>
            <input
              className='shadow text-black border outline-none rounded w-full py-2 px-3 text-grey-darker'
              id='name'
              value={form.name}
              type={"text"}
              placeholder='name'
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-grey-darker text-sm font-bold mb-2'>
              Mobile No.
            </label>
            <input
              className='shadow text-black border outline-none rounded w-full py-2 px-3 text-grey-darker'
              id='mobile'
              value={form.mobile}
              placeholder='mobile number'
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>
          <div className='mb-6'>
            <label className='block text-grey-darker text-sm font-bold mb-2'>
              Password
            </label>
            <input
              className='shadow text-black outline-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3'
              id='password'
              type='password'
              value={form.password}
              placeholder='password'
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button
            onClick={requestOtp}
            variant='contained'
            className='bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded'
            type='button'
          >
            {loading ? <TailSpin height={28} color='white' /> : "Otp Request"}
          </Button>
        </>
      )}
      <div id='recaptcha-container'></div>
    </div>
  );
};

export default Signup;
