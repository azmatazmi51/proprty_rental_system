import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchHouses, fetchUser } from '../../redux/action'

function Other({state}) {

  const navigate=useNavigate()

  useEffect(() => {
    // //console.log(state)
    navigate('/auth')
  }, [])
  
  return (
    <div>Other</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Other)