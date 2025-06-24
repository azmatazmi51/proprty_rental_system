import React, { useState } from 'react'
import { connect } from 'react-redux'
import AddIcon from '@mui/icons-material/Add';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Modal } from 'antd';
import Joi from 'joi';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllUsers } from '../../redux/action';

export const CreateUser = ({state,fetchAllUsers}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [userDetails, setUserDetails] = useState({
    name:'',
    email:'',
    password:'',
    role:''
  })

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).max(30).required(),
    role: Joi.string().valid('regular').valid('admin').valid('manager').required(),
  });

  const handleSubmit=()=>{
    const result = schema.validate(userDetails);
    //console.log(result); 
    //console.log(userDetails); 

    const { error } = result;

    if (!error) {
        axios.post("http://localhost:3001/user/create", {
            ...userDetails,
            name:userDetails.name.trim(),
            email:userDetails.email.toLowerCase().trim()
        },{
          headers:{
            jwt: JSON.parse(localStorage.getItem('token')).jwt
          }
        }).then((data)=>{
 
             //console.log(data.data)
              setUserDetails({
                name:'',
                email:'',
                password:'',
                role:''
              })

              setIsModalOpen(false)
              // fetchHouses();
              fetchAllUsers()

              setTimeout(() => {
                toast.success('Added the house successfully')
              }, 3000);
            
         }).catch((err)=>{
            //console.log(err)
             toast.error(err.response.data.message)
         }) 
 
     } else {
      //console.log(result.error)
    toast.error(result.error.message)
     }
}


  return (
    <div>
      <Button
      onClick={()=>setIsModalOpen(true)}>
      <AddIcon/>Add User
      </Button> 

      <Modal title="Add a User" open={isModalOpen} onOk={()=>handleSubmit()} onCancel={()=>{
        handleCancel();
        setUserDetails({
          name:'',
          email:'',
          password:'',
          role:''
        })}}>
      <Stack 
      sx={{m:2}}
      alignItems="center"
      justifyContent="center">
      <TextField 
      id="outlined-basic" 
      label="Name" 
      variant="outlined" 
      sx={{minWidth:400}}
      onChange={(e)=>setUserDetails({...userDetails,name:e.target.value})}
      value={userDetails.name}/>
      </Stack>
      <Stack
      direction="row" 
      sx={{m:2,mr:4.5,ml:4.5}} 
      spacing={2}
      alignItems="center"
      justifyContent="center"> 
      <TextField
          id="outlined-number"
          label="email"
          type={'email'}
          sx={{minWidth:180}}
          onChange={(e)=>setUserDetails({...userDetails,email:e.target.value})}
          value={userDetails.email}
        />
      <TextField
          id="outlined-number"
          label="Password"
          type={'password'}
          sx={{minWidth:180}}
          onChange={(e)=>setUserDetails({...userDetails,password:e.target.value})}
          value={userDetails.password}
        />
        </Stack>
        <Stack 
        
        alignItems="center"
        justifyContent="center">
        <FormControl 
        sx={{minWidth:400}}>
  <InputLabel id="demo-simple-select-label">Role</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={userDetails.role}
    label="Role"
    onChange={(e)=>setUserDetails({...userDetails,role:e.target.value})}
  >
    <MenuItem value={'regular'}>Regular</MenuItem>
    <MenuItem value={'manager'}>Manager</MenuItem>
    <MenuItem value={'admin'}>Admin</MenuItem>
  </Select>
</FormControl>
</Stack>
      </Modal>
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
  return {
    fetchAllUsers: () => dispatch(fetchAllUsers()),

  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser)