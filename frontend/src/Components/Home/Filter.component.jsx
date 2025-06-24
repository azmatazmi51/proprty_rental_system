import React, { useState } from 'react'
import { connect } from 'react-redux'
import Joi from 'joi';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { 
  Button,
  Stack, 
  TextField, 
  Typography
} from '@mui/material';
import { Modal } from 'antd';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from 'axios';
import { fetchFilteredHouses, fetchFilters, fetchHouses, fetchIsFilterSet } from '../../redux/action';

export const Filter = ({state,fetchFilteredHouses,fetchIsFilterSet,fetchHouses,fetchFilters}) => {

  const [filter, setFilter] = useState({
    rooms:'',
    floors:'',
    rental:'',
    area:''
  })

  const [filterModalOpen, setFilterModalOpen] = useState(false)

  const schema = Joi.object({
    area: Joi.number().min(25).max(10000),
    rental:Joi.number().min(100).max(100000),
    rooms:Joi.number().min(1).max(100),
    floors:Joi.number().min(1).max(50),
  });
//console.log(state)
  const handleSubmit=()=>{
    if(JSON.stringify(filter)==JSON.stringify({
      rooms:'',
      floors:'',
      rental:'',
      area:''
    }))
    {
      toast.error('Select atleast one filter')
      return
    }
    let tempFilter=filter
    Object.keys(tempFilter).forEach((element)=>{
      if(tempFilter[element]==='')
      {
        delete tempFilter[element]
      }
    })
    const result = schema.validate(tempFilter);
    //console.log(result); 
    const { error } = result;

    if (!error) {
      fetchFilters(tempFilter)
      fetchFilteredHouses(tempFilter)
      setFilterModalOpen(false)
      // setFilter(...filter,...state.filter)
    } 
    else {
      //console.log(result.error)
      toast.error(result.error.message)
    }

    //console.log('filters applied')
    //console.log(filter)

}
//console.log(filter)
  const clearFilter=()=>{
    //console.log('we')
    setFilter(
    {rooms:'',
    floors:'',
    rental:'',
    area:''});
    fetchFilters({})
      if(state.filterSet===true)
      {
        fetchHouses()
      }
    setFilterModalOpen(false)
    fetchIsFilterSet(false)
  }
  return (<>
    <div style={{'top':'200px'}} className='filterMaxWid'>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        mr={2}
      > 
      <TextField
          id="outlined-number"
          label="Area(In Sq. Ft.)"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setFilter({...filter,area:e.target.value})}
          value={filter.area}
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
          onChange={(e)=>setFilter({...filter,rental:e.target.value})}
          value={filter.rental}
          InputProps={{ inputProps: { min: 100, max: 100000 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="outlined-number"
          label="Rooms"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setFilter({...filter,rooms:e.target.value})}
          value={filter.rooms}
          InputProps={{ inputProps: { min: 1, max: 100 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      <TextField
          id="outlined-number"
          label="Floors"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setFilter({...filter,floors:e.target.value})}
          value={filter.floors}
          InputProps={{ inputProps: { min: 1, max: 50 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Stack>
        <Button onClick={()=>{handleSubmit()}}>Filter</Button>
        <Button onClick={()=>{clearFilter()}}color='error'>Clear Filter</Button>

    </div>

    <div className='filterMinWid'>
    <Button type="primary" onClick={()=>setFilterModalOpen(true)}>
    <FilterAltIcon/> 
      </Button>
      <Modal 
      title="Filter" 
      open={filterModalOpen} 
      onOk={()=>{handleSubmit();setFilterModalOpen(false);}} 
      onCancel={()=>{clearFilter()}}>
      <Stack
        direction="column"
        justifyContent="center"
        spacing={2}
        ml={10}
        mr={10}
      > 
      <TextField
          id="outlined-number"
          label="Area(In Sq. Ft.)"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setFilter({...filter,area:e.target.value})}
          value={filter.area}
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
          onChange={(e)=>setFilter({...filter,rental:e.target.value})}
          value={filter.rental}
          InputProps={{ inputProps: { min: 100, max: 100000 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="outlined-number"
          label="Rooms"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setFilter({...filter,rooms:e.target.value})}
          value={filter.rooms}
          InputProps={{ inputProps: { min: 1, max: 100 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      <TextField
          id="outlined-number"
          label="Floors"
          type="number"
          sx={{minWidth:190}}
          onChange={(e)=>setFilter({...filter,floors:e.target.value})}
          value={filter.floors}
          InputProps={{ inputProps: { min: 1, max: 50 } }}
          InputLabelProps={{
            shrink: true,
          }}
        />
         
        </Stack>
      </Modal>
    </div>
    <ToastContainer/>
    </>)
}

const mapStateToProps = (state) => {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFilteredHouses: (filter,pg) => dispatch(fetchFilteredHouses(filter,pg)),
    fetchIsFilterSet: (e) => dispatch(fetchIsFilterSet(e)),
    fetchHouses: (filter,pg) => dispatch(fetchHouses(filter,pg)),
    fetchFilters: (filter) => dispatch(fetchFilters(filter)),

  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)