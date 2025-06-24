import { CircularProgress, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchHouses, fetchMyHouses, fetchUser } from '../../redux/action'
import NavbarComponent from '../Navbar/Navbar.component'
import Other from '../Other/Other.component'
import AllHousesComponent from '../Home/AllHouses.component'
import FilterComponent from '../Home/Filter.component'
import './MyHouses.css'
import { useNavigate } from 'react-router-dom'

export const MyHouses = ({fetchUser,fetchMyHouses,state}) => {
  const navigate=useNavigate()

  useEffect(() => {
    if(localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
        localStorage.getItem('token')!=='' && JSON.parse(localStorage.getItem('token')).expiry>new Date().getTime()){
    fetchMyHouses() 
    fetchUser()
  }
  else{
    navigate('/auth')
  }
  }, [])
  
  return (
    <div>
      <NavbarComponent/>      
      <AllHousesComponent/>
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
    fetchMyHouses: (pg) => dispatch(fetchMyHouses(pg)),

  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(MyHouses)