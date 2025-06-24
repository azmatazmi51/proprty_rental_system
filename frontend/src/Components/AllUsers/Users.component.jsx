import { CircularProgress, Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchAllUsers } from '../../redux/action'
import OtherComponent from '../Other/Other.component'
import './AllUsers.css'
import userIcon from '../../Images/userIcon.png'
import { Modal } from 'antd';
import Joi from 'joi'
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

export const Users = ({state,fetchAllUsers}) => {

  const [options, setOptions] = useState({status:false,key:'',id:''})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeletetModalOpen] = useState(false)
  useEffect(() => {
    fetchAllUsers();
  }, [])

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
    role:''
  })
  let [page, setPage] = useState(1);

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email({ tlds: { allow: false } }).optional(),
    role: Joi.string().valid('regular').valid('admin').valid('manager').optional(),
  });

  const handleSubmit=()=>{
    let temp=userDetails;
    if(temp.name==="")
    {
      delete temp['name']
    }
    if(temp.email==="")
    {
      delete temp['email']
    }
    if(temp.role==="")
    {
      delete temp['role']
    }
    
    const result = schema.validate(temp);
    //console.log(result); 
    //console.log(temp); 

    const { error } = result;

    if (!error) {
        axios.put(`http://localhost:3001/user/${options.id}/update`, {
            ...temp
        },{
          headers:{
            jwt: JSON.parse(localStorage.getItem('token')).jwt
          }
        }).then((data)=>{
 
             //console.log(data.data)
              setUserDetails({
                name:'',
                email:'',
                role:''
              })

              setEditModalOpen(false)
              // fetchHouses();
              fetchAllUsers()

              setTimeout(() => {
                toast.success('User details edited successfully')
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

const handleDelete=()=>{
  axios.post(`http://localhost:3001/user/${options.id}/delete`,{
          headers:{
            jwt: JSON.parse(localStorage.getItem('token')).jwt
          }
        }).then((data)=>{
 
             //console.log(data.data)
              setDeletetModalOpen(false)
              // fetchHouses();

              setTimeout(() => {
                toast.success('Deleted the user successfully')
              }, 3000);
            
         }).catch((err)=>{
            //console.log(err)
             toast.error(err.response.data.message)
         })
}
const handlePageChange = (e, p) => {
  //console.log(p)
  setPage(p);
  // fetchChangedPage(p)
  //console.log(p)
  fetchAllUsers(p)

 

  //console.log(state)
  // fetchChangedPage(p)
  
};

  
  return(state.loading)?(<CircularProgress/>):(state.usersError)?(<OtherComponent/>):
  (
    <div>
      {state.allUsers.map((value,key)=>(
        <div key={key}
        className='fParent'
        >
          <div>
              <div 
              className='options'
              onClick={()=>setOptions({status:!options.status,key:key,id:value.id})}>
            <MoreVertIcon/>
            </div>
            {options.key===key && options.status===true && <div className='optionsBar'>
        <div 
        className='editModal'
        onClick={()=>{setEditModalOpen(true); 
        setOptions({status:false,key:'',id:value.id})}}>
          {/* <AccountCircleIcon/> */}
          Edit details
        </div>
        <hr />
        <div 
        className='deleteModal'
        onClick={()=>{setDeletetModalOpen(true); 
        setOptions({status:false,key:'',id:value.id})}}>
          {/* <LogoutIcon/> */}
          Delete user
        </div>
      </div>}
            </div>
            <div className='usersParent'>
            <img src={userIcon} alt="userIcon" width={'70px'} height={'70px'} className='icon'/>
            <h4 style={{'marginTop':'30px','marginLeft':'10px'}}>
            {value.name}
            </h4>
            <div style={{'marginTop':'80px','display':'flex','position':'absolute','transform':'translateX(10px)'}}>
            <div style={{'flex':'2','minWidth':'100px'}}>         
            <BadgeIcon/>
            {value.role}
          </div>
          <div style={{'flex':'3','minWidth':'400px','textAlign':'left'}}>
            <EmailIcon/>{value.email}
          </div>          
          </div>
        </div>
        
        </div>
      ))}
            <Stack 
        direction="row" 
        sx={{m:2}} 
        spacing={2}
        alignItems="center"
        justifyContent="center">
             <Pagination 
      count={state.userPage} 
      color="primary" 
      page={page}
      onChange={handlePageChange}/>
      </Stack> 
      <br />
      <Modal title="Edit User" open={editModalOpen} onOk={()=>handleSubmit()} onCancel={()=>{
        setEditModalOpen(false);
        setUserDetails({
          name:'',
          email:'',
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
          sx={{minWidth:400}}
          onChange={(e)=>setUserDetails({...userDetails,email:e.target.value})}
          value={userDetails.email}
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

      <Modal title="Edit User" open={deleteModalOpen} onOk={()=>handleDelete()} onCancel={()=>{
        setDeletetModalOpen(false);
        }}>
          Do you want to delete the user?
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
    fetchAllUsers: (pg) => dispatch(fetchAllUsers(pg)),

  } 
}
export default connect(mapStateToProps, mapDispatchToProps)(Users)