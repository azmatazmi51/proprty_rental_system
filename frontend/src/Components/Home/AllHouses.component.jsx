import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { CardHeader, CircularProgress, FormControl, IconButton, InputLabel, Menu, MenuItem, Pagination, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import OtherComponent from '../Other/Other.component'
import { fetchChangedPage, fetchFilteredHouses, fetchHouses, fetchMyHouses, fetchUser } from '../../redux/action'
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import HomeIcon from '../../Images/icons8-home-64.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react'
import { Modal } from 'antd';
import Joi from 'joi'
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from 'react-router-dom'

export const AllHouses = ({state,fetchHouses,fetchChangedPage,fetchMyHouses,fetchFilteredHouses,fetchUser}) => {


  
  const [options, setOptions] = useState({status:false,key:'',id:''})
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeletetModalOpen] = useState(false)
  const [propertyDetails, setPropertyDetails] = useState({
    address:'',
    area:'',
    rental:'',
    rooms:'',
    floors:'',
    longitude:'',
    latitude:'',
  })

  const [houseDetailsModalOpen, setHouseDetailsModalOpen] = useState(false);
  const [houseModalDetails, setHouseModalDetails] = useState({});

  let [page, setPage] = useState(1);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const schema = Joi.object({
    address: Joi.string(),
    area: Joi.number().min(25).max(10000),
    rental:Joi.number().min(100).max(100000),
    rooms:Joi.number().min(1).max(100),
    floors:Joi.number().min(1).max(50),
    longitude:Joi.number().min(-180).max(180),
    latitude:Joi.number().min(-90).max(90),
    isAvailable:Joi.bool(),

  });

const changeAvailablity=(availablity,id)=>{

  axios.put(`http://localhost:3001/house/${id}/updateDetails`, {isAvailable:availablity},{
          headers:{
            jwt: JSON.parse(localStorage.getItem('token')).jwt
          }
        }).then((data)=>{
 
          
              if(window.location.pathname!=='/MyHouses')
                fetchHouses(state.currentHousePage);
              else
                fetchMyHouses(state.currentHousePage);

              setTimeout(() => {
                if(availablity)
                toast.success('House made Available')
                else
                toast.success('House made Unavailable')

              }, 3000);
            
         }).catch((err)=>{
            //console.log(err)
             toast.error(err.response.data.message)
         }) 
 
}

  const handleSubmit=()=>{
    let tmp=propertyDetails

    Object.keys(tmp).forEach((element)=>{
      if(tmp[element]==='')
      {
        delete tmp[element];
      }
    })

    if('address' in tmp)
      {
        tmp={...tmp,address:tmp.address.trim()}
      }
    const result = schema.validate(tmp);
    //console.log(result); 
    const { error } = result;

    if (!error) {
        axios.put(`http://localhost:3001/house/${options.id}/updateDetails`, {...tmp},{
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
                latitude:'',
              })

              setEditModalOpen(false)
              if(window.location.pathname!=='/MyHouses')
                fetchHouses(state.currentHousePage);
              else
                fetchMyHouses(state.currentHousePage);

              setTimeout(() => {
                toast.success('Updated the house successfully')
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
  //console.log(options.id)
  axios.delete(`http://localhost:3001/house/${options.id}/delete`,{
          headers:{
            jwt: JSON.parse(localStorage.getItem('token')).jwt
          }
        }).then((data)=>{
 
             //console.log(data.data)

              setDeletetModalOpen(false)

              if(window.location.pathname!=='/MyHouses')
                fetchHouses(state.currentHousePage);
              else
                fetchMyHouses(state.currentHousePage);

              setTimeout(() => {
                toast.success('Deleted the house successfully')
              }, 3000);
            
         }).catch((err)=>{
            //console.log(err)
             toast.error(err.response.data.message)
         }) 
 
}

const handlePageChange = (e, p) => {
  //console.log(p)
  setPage(p);
  fetchChangedPage(p)
  //console.log(p)
  if(window.location.pathname!=='/MyHouses'){
    //console.log('eir')
    if(state.filterSet)
      fetchFilteredHouses(state.filter,p)
    else
    fetchHouses(p);
  }
  else
    fetchMyHouses(p);

  //console.log(state)
  // fetchChangedPage(p)
  
};

  return (state.loading)?(<CircularProgress/>):(state.houseError || state.userError)?(<OtherComponent/>):(
    <>
    
    {window.location.pathname!=='/MyHouses' && <h4 className='totalProperties'>
      {state.houses.length} results
   </h4>}
   <br />
   <br />
    <div>  
      {
        state.houses.map((value,key)=>(
         <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    key={key}
  >
   
              <Card sx={{ minWidth: 275 }}>
                {/* <CardHeader
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }/> */}
      <CardContent>
        {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography> */}
        <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  gridColumn={4}
  spacing={2}
>
<Typography variant="h5" component="div">
        <FmdGoodIcon/>{value.address}
        </Typography>
        {((state.user.role==='manager' && value.managedBy==state.user.id)||state.user.role==='admin') && <Stack
  direction="row"
  justifyContent="flex-end"
  alignItems="flex-end"
  spacing={2}
>
<Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={(e)=>{handleOpenUserMenu(e);setOptions({status:!options.status,key:key,id:value.id})}} aria-label="settings"sx={{ p: 0 }}>
             
                    <MoreVertIcon/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={()=>{setEditModalOpen(true); handleCloseUserMenu()}}>
                  <Typography textAlign="center">Edit</Typography>
                </MenuItem>
                <MenuItem onClick={()=>{setDeletetModalOpen(true);handleCloseUserMenu();}}>
                  <Typography textAlign="center">Delete</Typography>
                </MenuItem>
            </Menu>
          </Box>

</Stack>}
</Stack>
        
        
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Area{" "+value.area+"sq.ft."}
        </Typography>
        <Typography variant="body2">
          Rs{" "+value.rental}
          
        </Typography>
        {(state.user.role==='admin' || (state.user.role==='manager' && value.managedBy==state.user.id))&&<Typography>
              {value.isAvailable && <Button color='primary' variant='contained'
              onClick={()=>changeAvailablity(!value.isAvailable,value.id)}><DoneIcon/></Button>}
              {!value.isAvailable && <Button color='primary' variant=''
              onClick={()=>changeAvailablity(!value.isAvailable,value.id)}><DoneIcon/></Button>}
        </Typography>}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>{setHouseDetailsModalOpen(true);setHouseModalDetails({...value})}}>Learn More</Button>
      </CardActions>
    </Card>
    {/* • */}
  </Box>
       
        ))
      }
    </div>
    <Modal title="House Details" open={houseDetailsModalOpen} onOk={()=>setHouseDetailsModalOpen(false)} onCancel={()=>{setHouseDetailsModalOpen(false)}}
        >
        <Typography variant="h5" component="div">
        <FmdGoodIcon/>Address
        </Typography>
        <Typography>
          {houseModalDetails.address}
        </Typography>
        <Stack 
        direction={'row'}
        justifyContent="space-between"
        alignItems="flex-end"
        spacing={2}>
          <Box>
        <Typography variant="h5" component="div">
        Area
        </Typography>
        <Typography>
          {houseModalDetails.area+"sq.ft."}
        </Typography>
        </Box>
        <Box>
        <Typography variant="h5" component="div">
        Rental
        </Typography>
        <Typography>
          {"Rs."+houseModalDetails.rental}
        </Typography>
        </Box>
        </Stack>
        <Stack 
        direction={'row'}
        justifyContent="space-between"
        alignItems="flex-end"
        spacing={2}>
          <Box>
        <Typography variant="h5" component="div">
        Rooms
        </Typography>
        <Typography>
          {houseModalDetails.rooms}
        </Typography>
        </Box>
        <Box>
        <Typography variant="h5" component="div">
        Floors
        </Typography>
        <Typography>
          {houseModalDetails.floors}
        </Typography>
        </Box>
        </Stack>
        <Stack 
        direction={'row'}
        justifyContent="space-between"
        alignItems="flex-end"
        spacing={2}>
          <Box>
        <Typography variant="h5" component="div">
        Longitude
        </Typography>
        <Typography>
          {houseModalDetails.longitude}
        </Typography>
        </Box>
        <Box>
        <Typography variant="h5" component="div">
        Latitude
        </Typography>
        <Typography>
          {houseModalDetails.latitude}
        </Typography>
        </Box>
        </Stack>
        </Modal>
    <Modal title="Edit House" open={editModalOpen} onOk={()=>handleSubmit()} onCancel={()=>{
        setEditModalOpen(false);
        setPropertyDetails({
          address:'',
          area:'',
          rental:'',
          rooms:'',
          floors:'',
          longitude:'',
          latitude:'',
          isAvailable:''
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
        {/* <FormControl fullWidth sx={{mr:5}} >
  <InputLabel id="demo-simple-select-label">Availablity</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={propertyDetails.isAvailable}
    label="availablity"
    onChange={(e)=>setPropertyDetails({...propertyDetails,isAvailable:e.target.value})}
  >
    <MenuItem value={true}>Available</MenuItem>
    <MenuItem value={false}>Unavailble</MenuItem>
  </Select>
</FormControl> */}
      </Modal>

      <Modal title="Delete House" open={deleteModalOpen} onOk={()=>handleDelete()} onCancel={()=>{
        setDeletetModalOpen(false);}}>
          Do you want to delete the property? 
        </Modal>
        <Stack 
        direction="row" 
        sx={{m:2}} 
        spacing={2}
        alignItems="center"
        justifyContent="center">
      <Pagination 
      count={state.totalPages} 
      color="primary" 
      page={state.currentHousePage}
      onChange={handlePageChange}/>
    </Stack>
    <ToastContainer/>
    <br />
    </>
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
    fetchHouses: (pg) => dispatch(fetchHouses(pg)),
    fetchChangedPage: (pg) => dispatch(fetchChangedPage(pg)),
    fetchMyHouses: (pg) => dispatch(fetchMyHouses(pg)),
    fetchFilteredHouses: (filter,pg) => dispatch(fetchFilteredHouses(filter,pg)),
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(AllHouses)