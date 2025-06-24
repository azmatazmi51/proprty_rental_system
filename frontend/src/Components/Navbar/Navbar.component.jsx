import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import './Navbar.css'
import Logo from '../../Images/house.png'
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom'
import { Button, Modal } from 'antd';
import "antd/dist/antd.css";
import userImage from '../../Images/user.png'
import MailIcon from '@mui/icons-material/Mail';import FaceIcon from '@mui/icons-material/Face';
import { fetchUser } from '../../redux/action'
import { useEffect } from 'react'
import Other from '../Other/Other.component'
import DehazeIcon from '@mui/icons-material/Dehaze';
import HouseIcon from '@mui/icons-material/House';
import GroupIcon from '@mui/icons-material/Group';
export const Navbar = ({fetchUser,state}) => {


  
  const navigate=useNavigate();
  const [setting, setSetting] = useState(false)
  const [isMyAccountModal, setIsMyAccountModal] = useState(false);
  const [smallWidthOption, setSmallWidthOption] = useState(false)


  const logout=()=>{
    localStorage.clear();
    navigate('/auth')
  }

  const showModal = () => {
    setIsMyAccountModal(true);
  };

  const handleOk = () => {
    setIsMyAccountModal(false);
  };

  const handleCancel = () => {
    setIsMyAccountModal(false);
  };

  return(
    <div className='navbar'>
      <img 
      src={Logo} 
      alt="Logo" 
      width={'50px'} 
      className='logo'
      onClick={()=>navigate('/')}/>
      
      <div 
      className="title"
      onClick={()=>navigate('/')}>
        HouseDoor
      </div>
 
     {(state.user.role==='manager' || state.user.role==='admin') && 
     <div 
     className='myProperty'
     onClick={()=>navigate('/MyHouses')}>
        My Property
      </div>}

      {state.user.role==='admin' && <div className='allUsers'
      onClick={()=>navigate('/AllUsers')}>
        All Users
      </div>}
      <div className='smallWidthOption'>
        
        
      </div>
  
      <Button
        className='threeLines'
        onClick={()=>setSetting(!setting)} >
        <DehazeIcon/>
        </Button>
      
      {setting && <div className='setting'>
        <div 
        className='account'
        onClick={()=>{setIsMyAccountModal(true); setSetting(false)}}>
          <AccountCircleIcon/>
          My Account
        </div>
        <div className='smallWidthOption'>

        <hr />
        {state.user.role!=='regular' && <div 
          className='myHouse'
          onClick={()=>{navigate('/myHouses')}}>
            <HouseIcon/>
            My House
            
          </div>}
          {state.user.role==='admin' &&<hr />}
          {state.user.role==='admin' && <div 
          className='allUsers1'
          onClick={()=>{navigate('/allUsers')}}>
            {/* <hr /> */}
            <GroupIcon/>
            All Users
            </div>

          }
          </div>
<hr />
       
        <div 
        className='logout'
        onClick={()=>{logout()}}>
          <LogoutIcon/>
          Logout
        </div>
      </div>}
      <Modal 
      title="My Account" 
      open={isMyAccountModal} 
      onOk={handleOk} 
      onCancel={handleCancel}>
        <div>
        <img 
        src={userImage} 
        alt="User Image" 
        width={'50px'}
        className='accountDetails'/>
        <div className='nameMail'>
        <div className='name'>
          <FaceIcon/>
          {state.user.name}
        </div>
        <div className='mail'>
          <MailIcon/>
          {state.user.email}
        </div>
        </div>
        </div>
      </Modal>
    </div>
  )
}



const mapStateToProps = (state) =>  {
  return {
      state: state
    }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(fetchUser()),
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)