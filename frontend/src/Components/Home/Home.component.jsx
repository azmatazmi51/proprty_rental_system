import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchHouses, fetchUser } from '../../redux/action'
import NavbarComponent from '../Navbar/Navbar.component'
import AddHouseComponent from './AddHouse.component'
import AllHousesComponent from './AllHouses.component'
import FilterComponent from './Filter.component'
import './Home.css'

export const Home = ({fetchUser,fetchHouses,state}) => {

  const navigate=useNavigate()
 
  useEffect(() => {
    if(localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
        localStorage.getItem('token')!=='' && JSON.parse(localStorage.getItem('token')).expiry>new Date().getTime()){
    fetchHouses() 
    fetchUser()  
  }
  else{
    navigate('/auth')
  }
   // eslint-disable-next-line
  }, [])
  
  return (
    <div>
      <NavbarComponent/>
      <AddHouseComponent/>
      
      <FilterComponent/>
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
    fetchHouses: (pg) => dispatch(fetchHouses(pg)),

  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)