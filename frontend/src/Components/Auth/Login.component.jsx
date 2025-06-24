import React, { useEffect, useState } from 'react'
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
import { connect } from 'react-redux';
import { fetchUser } from '../../redux/action';



const Login=({fetchUser})=>{
  const navigate=useNavigate();


  useEffect(() => {
    if(localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
        localStorage.getItem('token')!=='' && JSON.parse(localStorage.getItem('token')).expiry>new Date().getTime()){


    fetchUser();
    navigate('/')
  }
 
  }, [])
  
  const [loginForm, setLoginForm] = useState({
    email:'',
    password:''
  })
  const schema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).max(30).required()
  });

  const handleSubmit=()=>{
    const result = schema.validate(loginForm);
    //console.log(result); 
    const { error } = result;

    if (!error) {
        axios.post("http://localhost:3001/user/login", {
            email:loginForm.email.toLowerCase(),
            password:loginForm.password
        }).then((data)=>{
 
             //console.log(data.data)
             localStorage.setItem('token',JSON.stringify({jwt:data.data.jwt,expiry:new Date().getTime()+5*3600000,role:data.data.role}))
             toast.success('Logged in successfully')

             setTimeout(() => {
             navigate('/')
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
        Welcome Back:)
      </h1>
      <TextField 
      id="standard-basic1" 
      label="Email" 
      type={'email'}
      variant="standard" 
      sx={{mt:2,width: 300}} 
      value={loginForm.email}
      onChange={(e)=>setLoginForm({...loginForm,email:e.target.value})}/>
    
      <TextField 
      id="standard-basic2" 
      label="Password" 
      variant="standard" 
      type={'password'} 
      sx={{mt:2,mb:2,width: 300}} 
      value={loginForm.password} 
      onChange={(e)=>setLoginForm({...loginForm,password:e.target.value})}/>
      <br />
    
      <Button 
      className='submit' 
      sx={{maxWidth:200,m:'auto'}}
      onClick={()=>{handleSubmit()}}>
        Submit
      </Button>
      <ToastContainer/>
    </div>
  )
}



const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return{
      fetchUser: () => dispatch(fetchUser()),
    }
}


  
export default connect(mapStateToProps,mapDispatchToProps)(Login)