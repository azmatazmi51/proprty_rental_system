import React, { useState } from 'react'
import './Auth.css'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import axios from 'axios'
import Joi from 'joi';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Register=({formStatus})=>{
  const [registerForm, setRegisterForm] = useState({
    name:'',
    email:'',
    password:'',
    role:''
})

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(30).required(),
  name:Joi.string().min(3).max(30).required(),
  role:Joi.string().valid('manager').valid('regular').required()
});

const handleSubmit=(role)=>{
  let temp=registerForm

  temp={...temp,name:temp.name.trim(),email:temp.email.toLowerCase().trim(),role:role}

  const result = schema.validate(temp);
  //console.log(result); 
  const { error } = result;

  if (!error) {
      axios.post("http://localhost:3001/user/register", {...temp}).then((data)=>{

          //  //console.log(data.data)
          //  localStorage.setItem('token',JSON.stringify({jwt:data.data.jwt,expiry:new Date().getTime()+5*3600000,role:data.data.role}))
           toast.success('Signed Up successfully, Now Login')

           setTimeout(() => {
          formStatus('login')

           }, 3000);
          // fetchUser();
          
       }).catch((err)=>{
          //console.log(err)
           toast.error(err.response.data.message)
       }) 

   } else {
  toast.error(result.error.message)
   }
}


  return(
    <div>
      <br />
       <h1 
       style={{'fontFamily':'monospace'}}>
        Register
       </h1>
    <TextField 
    id="standard-basic1" 
    label="Name" 
    variant="standard" 
    sx={{mt:2,width: 300}} 
    value={registerForm.name} 
    onChange={(e)=>setRegisterForm({...registerForm,name:e.target.value})}/>

    <TextField 
    id="standard-basic2" 
    label="Email" 
    variant="standard" 
    type={"email"} 
    sx={{mt:2,width: 300}} 
    value={registerForm.email} 
    onChange={(e)=>setRegisterForm({...registerForm,email:e.target.value})}/>

    <TextField 
    id="standard-basic3" 
    label="Password" 
    variant="standard" 
    type={'password'} 
    sx={{mt:2,mb:2,width: 300}} 
    value={registerForm.password} 
    onChange={(e)=>setRegisterForm({...registerForm,password:e.target.value})}/>
    <br />


    <h5>
      Sign up as
    </h5>
    <Stack 
    direction={'row'}
    alignItems={'center'}
    justifyContent={'center'}
    spacing={2}>
      <div 
      className='btn btn-outline-primary'
      onClick={()=>handleSubmit('manager')}>Seller</div>
      <div 
      className='btn btn-outline-success'
      onClick={()=>handleSubmit('regular')}>Buyer</div>

    </Stack>
   
    <ToastContainer/>
    </div>
  )
}

export default Register