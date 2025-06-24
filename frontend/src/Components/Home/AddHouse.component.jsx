import React, { useState } from 'react'
import { connect } from 'react-redux'
import AddIcon from '@mui/icons-material/Add';
import { Button, Stack, TextField } from '@mui/material';
import { Modal } from 'antd';
import Joi from 'joi';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { fetchHouses, fetchUser } from '../../redux/action';


export const AddHouse = ({state,fetchHouses}) => {
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

  const [propertyDetails, setPropertyDetails] = useState({
    address:'',
    area:'',
    rental:'',
    rooms:'',
    floors:'',
    longitude:'',
    latitude:''
  })

  const schema = Joi.object({
    address: Joi.string().required(),
    area: Joi.number().min(25).max(10000).required(),
    rental:Joi.number().min(100).max(100000).required(),
    rooms:Joi.number().min(1).max(100).required(),
    floors:Joi.number().min(1).max(50).required(),
    longitude:Joi.number().min(-180).max(180).required(),
    latitude:Joi.number().min(-90).max(90).required(),


  });

  const handleSubmit=()=>{
    const result = schema.validate(propertyDetails);
    //console.log(result); 
    const { error } = result;

    if (!error) {
        axios.post("http://localhost:3001/house/create", {
            ...propertyDetails,
            address:propertyDetails.address.trim()
        },{
          headers:{
            jwt: JSON.parse(localStorage.getItem('token')).jwt
          }
        }).then((data)=>{
 
             //console.log(data.data)
              setPropertyDetails({
                address:'',
                area:'',
                rental:'',
                rooms:'',
                floors:'',
                longitude:'',
                latitude:''
              })

              setIsModalOpen(false)
              fetchHouses();

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
      <AddIcon/>Add House
      </Button> 

      <Modal title="Add a House" open={isModalOpen} onOk={()=>handleSubmit()} onCancel={()=>{
        handleCancel();
        setPropertyDetails({
                address:'',
                area:'',
                rental:'',
                rooms:'',
                floors:'',
                longitude:'',
                latitude:''
              })}}>
      <Stack 
      sx={{m:2}}
      alignItems="center"
      justifyContent="center">
      <TextField 
      id="outlined-basic" 
      label="Address" 
      variant="outlined" 
      sx={{minWidth:400}}
      onChange={(e)=>setPropertyDetails({...propertyDetails,address:e.target.value})}
      value={propertyDetails.address}/>
      </Stack>
      <Stack
      direction="row" 
      sx={{m:2}} 
      spacing={2}
      alignItems="center"
      justifyContent="center"> 
      <TextField
          id="outlined-number"
          label="Area(In Sq. Ft.)"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setPropertyDetails({...propertyDetails,area:e.target.value})}
          value={propertyDetails.area}
          InputProps={{ inputProps: { min: 25, max: 10000 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      <TextField
          id="outlined-number"
          label="Monthly Rental(In Rs.)"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setPropertyDetails({...propertyDetails,rental:e.target.value})}
          value={propertyDetails.rental}
          InputProps={{ inputProps: { min: 100, max: 100000 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Stack>
        <Stack 
        direction="row" 
        sx={{m:2}} 
        spacing={2}
        alignItems="center"
        justifyContent="center">
      <TextField
          id="outlined-number"
          label="Rooms"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setPropertyDetails({...propertyDetails,rooms:e.target.value})}
          value={propertyDetails.rooms}
          InputProps={{ inputProps: { min: 1, max: 100} }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      <TextField
          id="outlined-number"
          label="Floors"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setPropertyDetails({...propertyDetails,floors:e.target.value})}
          value={propertyDetails.floors}
          InputProps={{ inputProps: { min: 1, max: 50} }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Stack>
        <Stack 
        direction="row" 
        sx={{m:2}} 
        spacing={2}
        alignItems="center"
        justifyContent="center">
      <TextField
          id="outlined-number"
          label="Logitude"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setPropertyDetails({...propertyDetails,longitude:e.target.value})}
          value={propertyDetails.longitude}
          InputProps={{ inputProps: { min: -180, max: 180} }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      <TextField
          id="outlined-number"
          label="Latitude"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setPropertyDetails({...propertyDetails,latitude:e.target.value})}
          value={propertyDetails.latitude}
          InputProps={{ inputProps: { min: -90, max: 90 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
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
    fetchUser: () => dispatch(fetchUser()),
    fetchHouses: () => dispatch(fetchHouses()),

  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(AddHouse)