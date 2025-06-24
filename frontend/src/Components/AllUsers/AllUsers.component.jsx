import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUser } from '../../redux/action'
import NavbarComponent from '../Navbar/Navbar.component'
import CreateUserComponent from './CreateUser.component'
import UsersComponent from './Users.component'

export const AllUsers = ({state,fetchUser}) => {
  const navigate=useNavigate()

  useEffect(() => {
    if(localStorage.getItem('token')!==null && localStorage.getItem('token')!==undefined &&
        localStorage.getItem('token')!=='' && JSON.parse(localStorage.getItem('token')).expiry>new Date().getTime()){
    fetchUser()
  }
  else{
    navigate('/auth')
  }
  }, [])

  // //console.log('state')
  // //console.log(state)

  return (
    <div>
      <NavbarComponent/>
      <CreateUserComponent/>
      <UsersComponent/>
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

  } 
}
export default connect(mapStateToProps, mapDispatchToProps)(AllUsers)