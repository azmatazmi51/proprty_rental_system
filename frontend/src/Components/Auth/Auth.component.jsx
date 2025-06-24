import React, { useState } from 'react'
import './Auth.css'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button' 
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios'
import Joi from 'joi';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Login from './Login.component'
import Register from './Register.component'


function Auth() {
  const [formStatus, setFormStatus] = useState('login')
  
  return (
    <div className='binder'>
      

    <form className='form'>
    
        <Stack>
            <div className='formTop'>
                <div className='loginTop' onClick={()=>{setFormStatus('login')}} >
                    
                    Login
                </div>
                <div className='registerTop' onClick={()=>{setFormStatus('register')}}>
                    Register
                </div>
            </div>
            {formStatus==='login'?<Login/>:<Register formStatus={setFormStatus}/>}
        </Stack>
    </form> 
    </div>
  )
}

export default Auth